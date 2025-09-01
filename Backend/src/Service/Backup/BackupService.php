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

use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\MediaType;
use App\Repository\TracklistRepository;

class BackupService
{
    public function __construct(
        private readonly TracklistRepository $tracklistRepository,
        private readonly HashService         $hashService
    ) {
    }

    /**
     * @return array{tracklists: array<mixed>, count: int}
     */
    public function generateBackupData(User $user): array
    {
        $tracklists = $this->tracklistRepository->findBy(['user' => $user]);
        $backupData = [];

        foreach ($tracklists as $tracklist)
        {
            $media = $tracklist->getMedia();
            if (null === $media)
            {
                continue;
            }

            $entryData = [
                'tmdbId' => $media->getTmdbID(),
                'mediaType' => $media->getType()?->value,
                'status' => $tracklist->getStatus()?->value,
                'rating' => $tracklist->getRating(),
                'isRewatching' => $tracklist->isRewatching(),
                'startDate' => $tracklist->getStartDate()?->format('Y-m-d'),
                'finishDate' => $tracklist->getFinishDate()?->format('Y-m-d'),
            ];

            if ($media->getType() === MediaType::TV)
            {
                $entryData['seasons'] = $this->buildSeasonsData($tracklist->getTracklistSeasons()->toArray());
            }

            // The hash for the tracklist must be calculated AFTER seasons are added.
            $hash = $this->hashService->generateForData($entryData);
            $entryData['hash'] = $tracklist->getBackupHash() ?? $hash;

            $backupData[] = $entryData;
        }

        return [
            'tracklists' => $backupData,
            'count' => count($backupData),
        ];
    }

    /**
     * @param array<TracklistSeason> $tracklistSeasons
     * @return array<mixed>
     */
    private function buildSeasonsData(array $tracklistSeasons): array
    {
        $seasonsData = [];
        foreach ($tracklistSeasons as $tracklistSeason)
        {
            $season = $tracklistSeason->getSeason();
            if (null === $season)
            {
                continue;
            }

            $seasonEntry = [
                'seasonNumber' => $season->getSeasonNumber(),
                'episodes' => $this->buildEpisodesData($tracklistSeason->getTracklistEpisodes()->toArray()),
            ];

            // The hash for the season must be calculated AFTER episodes are added.
            $hash = $this->hashService->generateForData($seasonEntry);
            $seasonEntry['hash'] = $tracklistSeason->getBackupHash() ?? $hash;

            $seasonsData[] = $seasonEntry;
        }
        return $seasonsData;
    }

    /**
     * @param array<TracklistEpisode> $tracklistEpisodes
     * @return array<mixed>
     */
    private function buildEpisodesData(array $tracklistEpisodes): array
    {
        $episodesData = [];
        foreach ($tracklistEpisodes as $tracklistEpisode)
        {
            $episode = $tracklistEpisode->getEpisode();
            if (null === $episode)
            {
                continue;
            }

            $episodeEntry = [
                'episodeNumber' => $episode->getEpisodeNumber(),
                'watchDate' => $tracklistEpisode->getWatchDate()?->format('Y-m-d H:i:s'),
            ];

            $hash = $this->hashService->generateForData($episodeEntry);
            $episodeEntry['hash'] = $tracklistEpisode->getBackupHash() ?? $hash;

            $episodesData[] = $episodeEntry;
        }
        return $episodesData;
    }
}
