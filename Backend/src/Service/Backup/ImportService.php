<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Service\Backup;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\MediaType;
use App\Enum\TracklistStatus;
use App\Model\Request\Media\MediaIdDto;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\Media\MediaService;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Attribute\RateLimiter;
use Symfony\Component\RateLimiter\LimiterInterface;

class ImportService
{
    private const BATCH_SIZE = 20;

    public function __construct(
        private readonly EntityManagerInterface    $entityManager,
        private readonly TracklistRepository       $tracklistRepository,
        private readonly TracklistSeasonRepository $tracklistSeasonRepository,
        private readonly TracklistEpisodeRepository $tracklistEpisodeRepository,
        private readonly MediaService              $mediaService,
        #[RateLimiter('tmdb_api')]
        private readonly LimiterInterface          $tmdbApiLimiter,
        private readonly LoggerInterface           $logger
    ) {
    }

    /**
     * @param array{tracklists?: array<mixed>} $backupData
     * @return array{imported: int, updated: int, skipped: int, failed: int}
     */
    public function processImport(array $backupData, User $user): array
    {
        $stats = ['imported' => 0, 'updated' => 0, 'skipped' => 0, 'failed' => 0];
        $i = 0;

        foreach ($backupData['tracklists'] ?? [] as $item)
        {
            $this->entityManager->beginTransaction();
            try
            {
                $this->tmdbApiLimiter->consume()->wait();
                $mediaDto = new MediaIdDto($item['tmdbId'] ?? 0, $item['mediaType'] ?? '');
                $media = $this->mediaService->findOrCreateMedia($mediaDto);

                if (null === $media)
                {
                    $stats['failed']++;
                    $this->entityManager->rollback();
                    continue;
                }

                // Find or create the main tracklist entry
                $tracklist = $this->findOrCreateTracklist($item, $user, $media);
                if ($tracklist->getId() !== null) {
                    $stats['updated']++;
                } else {
                    $stats['imported']++;
                }

                $this->updateTracklistData($tracklist, $item);
                $this->entityManager->persist($tracklist);

                // If it's a show, process seasons and episodes
                if ($media->getType() === MediaType::SHOW)
                {
                    $this->importSeasonsAndEpisodes($tracklist, $item['seasons'] ?? []);
                }

                if ((++$i % self::BATCH_SIZE) === 0) {
                    $this->entityManager->commit();
                    $this->entityManager->flush();
                } else {
                    $this->entityManager->commit();
                }
            }
            catch (Exception $e)
            {
                $this->entityManager->rollback();
                $this->logger->error('Failed to import tracklist item.', ['item' => $item, 'exception' => $e->getMessage()]);
                $stats['failed']++;
            }
        }

        $this->entityManager->flush();
        return $stats;
    }

    private function findOrCreateTracklist(array $itemData, User $user, Media $media): Tracklist
    {
        $hash = $itemData['hash'] ?? null;
        if ($hash) {
            $tracklist = $this->tracklistRepository->findOneBy(['backupHash' => $hash, 'user' => $user]);
            if ($tracklist) {
                return $tracklist;
            }
        }

        // Fallback to media and user for existing tracklists that were not imported
        $tracklist = $this->tracklistRepository->findOneBy(['media' => $media, 'user' => $user]);
        if ($tracklist) {
            return $tracklist;
        }

        return (new Tracklist())->setUser($user)->setMedia($media);
    }

    private function updateTracklistData(Tracklist $tracklist, array $itemData): void
    {
        $tracklist->setBackupHash($itemData['hash'] ?? null)
            ->setTracklistName($tracklist->getMedia()?->getName() ?? 'Unknown')
            ->setIsRewatching($itemData['isRewatching'] ?? false);

        if (isset($itemData['status']) && $status = TracklistStatus::tryFrom($itemData['status'])) {
            $tracklist->setStatus($status);
        }
        if (isset($itemData['rating'])) {
            $tracklist->setRating((int)$itemData['rating']);
        }
        if (!empty($itemData['startDate'])) {
            $tracklist->setStartDate(new DateTime($itemData['startDate']));
        }
        if (!empty($itemData['finishDate'])) {
            $tracklist->setFinishDate(new DateTime($itemData['finishDate']));
        }
    }

    private function importSeasonsAndEpisodes(Tracklist $tracklist, array $seasonsData): void
    {
        foreach ($seasonsData as $seasonData) {
            // Find or create TracklistSeason
            $seasonHash = $seasonData['hash'] ?? null;
            $tracklistSeason = $this->tracklistSeasonRepository->findOneBy(['backupHash' => $seasonHash]);

            if (!$tracklistSeason) {
                $seasonNumber = $seasonData['seasonNumber'] ?? -1;
                $season = $tracklist->getMedia()?->getSeasons()->filter(fn(Season $s) => $s->getSeasonNumber() === $seasonNumber)->first();
                if (!$season) continue;

                $tracklistSeason = (new TracklistSeason())
                    ->setTracklist($tracklist)
                    ->setSeason($season)
                    ->setBackupHash($seasonHash);
                $this->entityManager->persist($tracklistSeason);
            }

            // Process episodes for this season
            foreach ($seasonData['episodes'] ?? [] as $episodeData) {
                $episodeHash = $episodeData['hash'] ?? null;
                $tracklistEpisode = $this->tracklistEpisodeRepository->findOneBy(['backupHash' => $episodeHash]);

                if (!$tracklistEpisode) {
                    $episodeNumber = $episodeData['episodeNumber'] ?? -1;
                    $episode = $tracklistSeason->getSeason()?->getEpisodes()->filter(fn(Episode $e) => $e->getEpisodeNumber() === $episodeNumber)->first();
                    if (!$episode) continue;

                    $tracklistEpisode = (new TracklistEpisode())
                        ->setTracklistSeason($tracklistSeason)
                        ->setEpisode($episode)
                        ->setBackupHash($episodeHash);
                }

                if (!empty($episodeData['watchDate'])) {
                    $tracklistEpisode->setWatchDate(new DateTime($episodeData['watchDate']));
                } else {
                    $tracklistEpisode->setWatchDate(null);
                }
                $this->entityManager->persist($tracklistEpisode);
            }
        }
    }
}
