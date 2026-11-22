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
use App\Model\Request\TracklistEpisode\CreateTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\CreateBulkTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\UpdateBulkTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\UpdateTracklistEpisodeRequestDto;
use App\Model\Response\Tracklist\TracklistSeason\TracklistEpisode\TracklistEpisodeDetailDataDto;
use App\Repository\EpisodeRepository;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\WatchActivity\WatchActivitySynchronizer;
use DateTimeImmutable;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

readonly class TracklistEpisodeService
{
    public function __construct(
        private TracklistSeasonRepository  $tracklistSeasonRepository,
        private TracklistEpisodeRepository $tracklistEpisodeRepository,
        private EpisodeRepository          $episodeRepository,
        private EntityManagerInterface     $entityManager,
        private WatchActivitySynchronizer  $watchActivitySynchronizer,
    ){}

    /**
     * @param CreateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @return TracklistEpisodeDetailDataDto
     * @throws Throwable
     */
    public function createTracklistEpisode(
        CreateTracklistEpisodeRequestDto $dto,
        User $user,
    ): TracklistEpisodeDetailDataDto
    {
        return $this->createBulkTracklistEpisodes(new CreateBulkTracklistEpisodeRequestDto([$dto]), $user)[0];
    }

    /**
     * @param CreateBulkTracklistEpisodeRequestDto $dto
     * @param User $user
     * @return list<TracklistEpisodeDetailDataDto>
     * @throws Throwable
     */
    public function createBulkTracklistEpisodes(
        CreateBulkTracklistEpisodeRequestDto $dto,
        User $user,
    ): array
    {
        $items = array_values($dto->episodes);
        $indicesBySeason = [];
        foreach ($items as $index => $item) {
            if (isset($indicesBySeason[$item->tracklistSeasonId][$item->episodeId])) {
                throw new ConflictHttpException('This episode is already added to the tracklist season.');
            }
            $indicesBySeason[$item->tracklistSeasonId][$item->episodeId] = $index;
        }

        $episodes = [];
        foreach ($indicesBySeason as $seasonId => $indices) {
            $season = $this->tracklistSeasonRepository->find($seasonId);
            if (!$season instanceof TracklistSeason || $season->getTracklist()->getUser() !== $user) {
                throw new NotFoundHttpException('Tracklist season not found or access denied.');
            }
            foreach ($indices as $index) {
                if ($season->getTracklist()->getId() !== $items[$index]->tracklistId) {
                    throw new NotFoundHttpException('Tracklist season does not belong to the specified tracklist.');
                }
            }

            $sources = $this->episodeRepository->findBy(['season' => $season->getSeason(), 'id' => array_keys($indices)]);
            if (count($sources) !== count($indices)) {
                throw new NotFoundHttpException('Episode not found or does not belong to the correct season.');
            }
            foreach ($sources as $source) {
                $index = $indices[$source->getId()];
                $episodes[$index] = (new TracklistEpisode())
                    ->setTracklistSeason($season)
                    ->setEpisode($source)
                    ->setWatchDate($items[$index]->watchDateTime);
            }
        }

        // Restore the request order after loading source episodes by season.
        ksort($episodes);
        foreach ($episodes as $episode) {
            $this->entityManager->persist($episode);
        }
        try {
            $this->watchActivitySynchronizer->flush(episodes: $episodes);
        } catch (UniqueConstraintViolationException $exception) {
            if (!str_contains($exception->getMessage(), 'uniq_tracklist_season_episode')) {
                throw $exception;
            }
            throw new ConflictHttpException('This episode is already added to the tracklist season.', $exception);
        }

        return array_map(TracklistEpisodeDetailDataDto::fromEntity(...), $episodes);
    }

    /**
     * @param int $tracklistEpisodeId
     * @param UpdateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @param Request $request
     * @return TracklistEpisodeDetailDataDto
     * @throws Throwable
     */
    public function updateTracklistEpisode(
        int $tracklistEpisodeId,
        UpdateTracklistEpisodeRequestDto $dto,
        User $user,
        Request $request
    ): TracklistEpisodeDetailDataDto
    {
        $tracklistEpisode = $this->getOwnedEpisodes([$tracklistEpisodeId], $user)[$tracklistEpisodeId];

        $requestData = $request->toArray();

        if (array_key_exists('watch_date_time', $requestData))
        {
            $tracklistEpisode->setWatchDate($dto->watchDateTime);
        }

        $tracklistEpisode->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->persist($tracklistEpisode);
        $this->watchActivitySynchronizer->flush(episodes: [$tracklistEpisode]);

        return TracklistEpisodeDetailDataDto::fromEntity($tracklistEpisode);
    }

    /**
     * @param int $tracklistEpisodeId
     * @param User $user
     * @return void
     */
    public function deleteTracklistEpisode(
        int $tracklistEpisodeId,
        User $user,
    ): void
    {
        $this->deleteBulkTracklistEpisodes([$tracklistEpisodeId], $user);
    }

    /** @return list<TracklistEpisodeDetailDataDto> */
    public function updateBulkTracklistEpisodes(UpdateBulkTracklistEpisodeRequestDto $dto, User $user): array
    {
        $episodes = $this->getOwnedEpisodes(array_column($dto->episodes, 'tracklistEpisodeId'), $user);
        $updated = [];
        $now = new DateTimeImmutable();
        foreach ($dto->episodes as $item) {
            $episode = $episodes[$item->tracklistEpisodeId];
            $episode->setWatchDate($item->watchDateTime)->setUpdatedAt($now);
            $updated[] = $episode;
        }
        $this->watchActivitySynchronizer->flush(episodes: $updated);

        return array_map(TracklistEpisodeDetailDataDto::fromEntity(...), $updated);
    }

    /** @param int[] $ids
     * @throws Throwable
     */
    public function deleteBulkTracklistEpisodes(array $ids, User $user): void
    {
        foreach ($this->getOwnedEpisodes($ids, $user) as $episode) {
            $this->entityManager->remove($episode);
        }
        // The watch_activity foreign key cascades deletes in the same flush.
        $this->watchActivitySynchronizer->flush();
    }

    /**
     * @param int[] $ids
     * @return array<int, TracklistEpisode> keyed by tracklist episode ID
     */
    private function getOwnedEpisodes(array $ids, User $user): array
    {
        if (count(array_unique($ids)) !== count($ids)) {
            throw new ConflictHttpException('Each tracklist episode ID may appear only once.');
        }

        $episodes = $this->tracklistEpisodeRepository->findByIdsAndUser($ids, $user);
        if (count($episodes) !== count($ids)) {
            throw new NotFoundHttpException('Tracklist episode not found or access denied.');
        }

        return $episodes;
    }
}
