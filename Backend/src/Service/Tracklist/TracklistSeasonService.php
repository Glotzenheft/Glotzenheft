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

namespace App\Service\Tracklist;

use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Model\Request\TracklistSeason\PatchTracklistSeasonEpisodesDto;
use App\Model\Response\Tracklist\TracklistSeason\TracklistSeasonDetailDataDto;
use App\Repository\EpisodeRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\WatchActivity\WatchActivitySynchronizer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class TracklistSeasonService
{
    public function __construct(
        private TracklistSeasonRepository $seasons,
        private EpisodeRepository $episodes,
        private EntityManagerInterface $entityManager,
        private WatchActivitySynchronizer $watchActivitySynchronizer,
    ) {}

    /** @return list<TracklistSeasonDetailDataDto> */
    public function getTracklistSeasons(User $user): array
    {
        return array_map(TracklistSeasonDetailDataDto::fromEntity(...), $this->seasons->findAllForUser($user));
    }

    public function getTracklistSeason(int $id, User $user): TracklistSeasonDetailDataDto
    {
        return TracklistSeasonDetailDataDto::fromEntity($this->ownedSeason($id, $user));
    }

    public function patchEpisodes(int $id, User $user, PatchTracklistSeasonEpisodesDto $dto): TracklistSeasonDetailDataDto
    {
        $states = [];
        foreach ($dto->episodes as $state) {
            if (isset($states[$state->episodeId])) {
                throw new ConflictHttpException('Each episode may appear only once.');
            }
            $states[$state->episodeId] = $state;
        }

        return $this->entityManager->getConnection()->transactional(function () use ($id, $user, $states) {
            $season = $this->ownedSeason($id, $user, forUpdate: true);
            $sources = $this->episodes->findBy(['season' => $season->getSeason(), 'id' => array_keys($states)]);
            if (count($sources) !== count($states)) {
                throw new NotFoundHttpException('Episode not found in this season.');
            }

            $sightings = [];
            foreach ($season->getTracklistEpisodes() as $sighting) {
                $sightings[$sighting->getEpisode()->getId()] = $sighting;
            }

            $changed = [];
            foreach ($sources as $source) {
                $state = $states[$source->getId()];
                $sighting = $sightings[$source->getId()] ?? null;
                if (!$state->watched) {
                    if ($sighting !== null) {
                        $season->removeTracklistEpisode($sighting);
                        $this->entityManager->remove($sighting);
                    }
                    continue;
                }

                if ($sighting === null) {
                    $sighting = (new TracklistEpisode())->setEpisode($source);
                    $season->addTracklistEpisode($sighting);
                    $this->entityManager->persist($sighting);
                } elseif ($sighting->getWatchDate() == $state->watchDateTime) {
                    continue;
                }
                $sighting->setWatchDate($state->watchDateTime);
                $changed[] = $sighting;
            }

            // Deletions cascade to watch_activity. Only surviving changes need an upsert.
            $this->watchActivitySynchronizer->flush(episodes: $changed);
            return TracklistSeasonDetailDataDto::fromEntity($season);
        });
    }

    private function ownedSeason(int $id, User $user, bool $forUpdate = false): TracklistSeason
    {
        return $this->seasons->findForUser($id, $user, $forUpdate)
            ?? throw new NotFoundHttpException('Tracklist season not found or access denied.');
    }
}
