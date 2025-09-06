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
use App\Repository\TracklistRepository;
use Doctrine\ORM\EntityManagerInterface;

readonly class CreateBackupService
{

    public function __construct(
        private TracklistRepository    $tracklistRepository,
        private EntityManagerInterface $entityManager,
        private HashService            $hashService
    ){}

    /**
     * @param User $user
     * @return array
     */
    public function generateBackupData(User $user): array
    {
        $tracklists = $this->tracklistRepository->findBy([
            'user' => $user
        ]);

        $backupData = [];
        foreach ($tracklists as $tracklist)
        {
            if (!$tracklist instanceof Tracklist)
                continue;
            $media = $tracklist->getMedia();
            if (!$media instanceof Media)
                continue;

            $entryData = [
                'tracklistName' => $tracklist->getTracklistName(),
                'tmdbId'        => $media->getTmdbID(),
                'mediaType'     => $media->getType()?->value,
                'status'        => $tracklist->getStatus()?->value,
                'rating'        => $tracklist->getRating(),
                'isRewatching'  => $tracklist->isRewatching(),
                'startDate'     => $tracklist->getStartDate()?->format('Y-m-d'),
                'finishDate'    => $tracklist->getFinishDate()?->format('Y-m-d'),
                'updatedAt'     => $tracklist->getUpdatedAt()?->format('Y-m-d H:i:s'),
                'createdAt'     => $tracklist->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];

            if ($media->getType() === MediaType::TV)
            {
                $entryData['seasons'] = $this->buildSeasonsData($tracklist->getTracklistSeasons()->toArray());
            }

            $hash = $this->hashService->generateForData($entryData);
            $entryData['hash'] = $tracklist->getBackupHash() ?? $hash;

            $tracklist->setBackupHash($hash);
            $this->entityManager->persist($tracklist);

            $backupData[] = $entryData;
        }

        return [
            'tracklists' => $backupData,
            'count' => count($backupData),
        ];
    }

    /**
     * @param array<TracklistSeason> $tracklistSeasons
     * @return array
     */
    private function buildSeasonsData(array $tracklistSeasons): array
    {
        $seasonsData = [];
        foreach ($tracklistSeasons as $tracklistSeason)
        {
            if (!$tracklistSeason instanceof TracklistSeason)
                continue;
            $season = $tracklistSeason->getSeason();
            if (!$season instanceof Season)
                continue;

            $seasonEntry = [
                'seasonNumber'  => $season->getSeasonNumber(),
                'episodes'      => $this->buildEpisodesData($tracklistSeason->getTracklistEpisodes()->toArray()),
                'createdAt'     => $tracklistSeason->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];

            $hash = $this->hashService->generateForData($seasonEntry);
            $seasonEntry['hash'] = $tracklistSeason->getBackupHash() ?? $hash;

            $seasonsData[] = $seasonEntry;
        }
        return $seasonsData;
    }

    /**
     * @param array<TracklistEpisode> $tracklistEpisodes
     * @return array
     */
    private function buildEpisodesData(array $tracklistEpisodes): array
    {
        $episodesData = [];
        foreach ($tracklistEpisodes as $tracklistEpisode)
        {
            $episode = $tracklistEpisode->getEpisode();
            if (!$episode instanceof Episode)
            {
                continue;
            }

            $episodeEntry = [
                'episodeNumber' => $episode->getEpisodeNumber(),
                'watchDate'     => $tracklistEpisode->getWatchDate()?->format('Y-m-d H:i:s'),
                'updatedAt'     => $tracklistEpisode->getUpdatedAt()?->format('Y-m-d H:i:s'),
                'createdAt'     => $tracklistEpisode->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];

            $hash = $this->hashService->generateForData($episodeEntry);
            $episodeEntry['hash'] = $tracklistEpisode->getBackupHash() ?? $hash;

            $episodesData[] = $episodeEntry;
        }
        return $episodesData;
    }
}