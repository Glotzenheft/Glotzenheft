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
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\RateLimiter\LimiterInterface;

class ImportService
{
    private LimiterInterface $tmdbApiLimiter;

    public function __construct(
        private readonly EntityManagerInterface    $entityManager,
        private readonly TracklistRepository       $tracklistRepository,
        private readonly TracklistSeasonRepository $tracklistSeasonRepository,
        private readonly TracklistEpisodeRepository $tracklistEpisodeRepository,
        private readonly MediaService              $mediaService,
        private readonly LoggerInterface           $logger,
        ContainerInterface                         $container
    ) {
        $this->tmdbApiLimiter = $container->get('rate_limiter.tmdb_api');
    }

    /**
     * @param array{tracklists?: array<mixed>} $backupData
     * @return array{imported: int, updated: int, skipped: int, failed: int}
     */
    public function processImport(array $backupData, User $user): array
    {
        $stats = ['imported' => 0, 'updated' => 0, 'skipped' => 0, 'failed' => 0];

        foreach ($backupData['tracklists'] ?? [] as $item)
        {
            try
            {
                $this->tmdbApiLimiter->consume()->wait();
                $mediaDto = new MediaIdDto($item['tmdbId'] ?? 0, $item['mediaType'] ?? '');
                $media = $this->mediaService->findOrCreateMedia($mediaDto);

                if (null === $media)
                {
                    $stats['failed']++;
                    continue;
                }

                $tracklist = $this->findOrCreateTracklist($item, $user, $media);
                if ($tracklist->getId() !== null) {
                    $stats['updated']++;
                } else {
                    $stats['imported']++;
                }

                $this->updateTracklistData($tracklist, $item);
                $this->entityManager->persist($tracklist);

                if ($media->getType() === MediaType::SHOW)
                {
                    $this->importSeasonsAndEpisodes($tracklist, $item['seasons'] ?? []);
                }
            }
            catch (Exception $e)
            {
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
            $tracklistSeason = $this->findOrCreateTracklistSeason($tracklist, $seasonData);
            $this->entityManager->persist($tracklistSeason);

            foreach ($seasonData['episodes'] ?? [] as $episodeData) {
                $tracklistEpisode = $this->findOrCreateTracklistEpisode($tracklistSeason, $episodeData);

                if (!empty($episodeData['watchDate'])) {
                    $tracklistEpisode->setWatchDate(new DateTime($episodeData['watchDate']));
                } else {
                    $tracklistEpisode->setWatchDate(null);
                }
                $this->entityManager->persist($tracklistEpisode);
            }
        }
    }

    private function findOrCreateTracklistSeason(Tracklist $tracklist, array $seasonData): TracklistSeason
    {
        $seasonHash = $seasonData['hash'] ?? null;
        if ($seasonHash) {
            $tracklistSeason = $this->tracklistSeasonRepository->findOneBy(['backupHash' => $seasonHash]);
            if ($tracklistSeason) return $tracklistSeason;
        }

        $seasonNumber = $seasonData['seasonNumber'] ?? -1;
        foreach ($tracklist->getTracklistSeasons() as $existingSeason) {
            if ($existingSeason->getSeason()?->getSeasonNumber() === $seasonNumber) {
                return $existingSeason;
            }
        }

        $season = $tracklist->getMedia()?->getSeasons()->filter(fn(Season $s) => $s->getSeasonNumber() === $seasonNumber)->first();
        if (!$season) {
            throw new Exception("Could not find Season {$seasonNumber} for media.");
        }

        return (new TracklistSeason())
            ->setTracklist($tracklist)
            ->setSeason($season)
            ->setBackupHash($seasonHash);
    }

    private function findOrCreateTracklistEpisode(TracklistSeason $tracklistSeason, array $episodeData): TracklistEpisode
    {
        $episodeHash = $episodeData['hash'] ?? null;
        if ($episodeHash) {
            $tracklistEpisode = $this->tracklistEpisodeRepository->findOneBy(['backupHash' => $episodeHash]);
            if ($tracklistEpisode) return $tracklistEpisode;
        }

        $episodeNumber = $episodeData['episodeNumber'] ?? -1;
        foreach ($tracklistSeason->getTracklistEpisodes() as $existingEpisode) {
            if ($existingEpisode->getEpisode()?->getEpisodeNumber() === $episodeNumber) {
                return $existingEpisode;
            }
        }

        $episode = $tracklistSeason->getSeason()?->getEpisodes()->filter(fn(Episode $e) => $e->getEpisodeNumber() === $episodeNumber)->first();
        if (!$episode) {
            throw new Exception("Could not find Episode {$episodeNumber} for season.");
        }

        return (new TracklistEpisode())
            ->setTracklistSeason($tracklistSeason)
            ->setEpisode($episode)
            ->setBackupHash($episodeHash);
    }
}
