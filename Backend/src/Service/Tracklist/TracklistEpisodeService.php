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

use App\Entity\Episode;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Model\Request\TracklistEpisode\CreateTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\UpdateTracklistEpisodeRequestDto;
use App\Model\Response\Tracklist\TracklistSeason\TracklistEpisode\TracklistEpisodeDetailDataDto;
use App\Repository\EpisodeRepository;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\RequestTrait;
use App\Service\Traits\EntityValidationTrait;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TracklistEpisodeService
{
    use RequestTrait;
    use EntityValidationTrait;

    public function __construct(
        private readonly TracklistRepository        $tracklistRepository,
        private readonly TracklistSeasonRepository  $tracklistSeasonRepository,
        private readonly TracklistEpisodeRepository $tracklistEpisodeRepository,
        private readonly EpisodeRepository          $episodeRepository,
        private readonly EntityManagerInterface     $entityManager,
    ){}

    /**
     * @param CreateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @return TracklistEpisodeDetailDataDto
     */
    public function createTracklistEpisode(
        CreateTracklistEpisodeRequestDto $dto,
        User $user,
    ): TracklistEpisodeDetailDataDto
    {
        [$tracklistSeason, $episode] = $this->fetchAndValidateDependencies($dto, $user);

        $tracklistEpisode = (new TracklistEpisode())
            ->setTracklistSeason($tracklistSeason)
            ->setEpisode($episode)
            ->setWatchDate($dto->watchDateTime);

        $this->entityManager->persist($tracklistEpisode);
        $this->entityManager->flush();

        return TracklistEpisodeDetailDataDto::fromEntity($tracklistEpisode);
    }

    /**
     * @param int $tracklistEpisodeId
     * @param UpdateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @param Request $request
     * @return TracklistEpisodeDetailDataDto
     */
    public function updateTracklistEpisode(
        int $tracklistEpisodeId,
        UpdateTracklistEpisodeRequestDto $dto,
        User $user,
        Request $request
    ): TracklistEpisodeDetailDataDto
    {

        $tracklistEpisode = $this->tracklistEpisodeRepository->find($tracklistEpisodeId);

        if (!$tracklistEpisode instanceof TracklistEpisode || $tracklistEpisode->getTracklistSeason()->getTracklist()->getUser() !== $user)
        {
            throw new NotFoundHttpException('Tracklist episode not found or access denied.');
        }

        $requestData = $request->toArray();

        if (array_key_exists('watch_date_time', $requestData))
        {
            $tracklistEpisode->setWatchDate($dto->watchDateTime);
        }

        $tracklistEpisode->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->persist($tracklistEpisode);
        $this->entityManager->flush();

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
        $tracklistEpisode = $this->tracklistEpisodeRepository->find($tracklistEpisodeId);

        if (!$tracklistEpisode instanceof TracklistEpisode || $tracklistEpisode->getTracklistSeason()->getTracklist()->getUser() !== $user)
        {
            throw new NotFoundHttpException('Tracklist episode not found or access denied.');
        }

        $this->entityManager->remove($tracklistEpisode);
        $this->entityManager->flush();
    }

    /**
     * @param CreateTracklistEpisodeRequestDto $dto
     * @param User $user
     * @return array{0: TracklistSeason, 1: Episode}
     */
    private function fetchAndValidateDependencies(
        CreateTracklistEpisodeRequestDto $dto,
        User $user
    ): array
    {
        $tracklistSeason = $this->tracklistSeasonRepository->findOneBy([
            'id' => $dto->tracklistSeasonId,
            'tracklist' => $dto->tracklistId,
        ]);

        if (!$tracklistSeason instanceof TracklistSeason || $tracklistSeason->getTracklist()->getUser() !== $user)
        {
            throw new NotFoundHttpException('Tracklist season not found, belongs to wrong tracklist, or access denied.');
        }

        $episode = $this->episodeRepository->findOneBy([
            'id' => $dto->episodeId,
            'season' => $tracklistSeason->getSeason(),
        ]);

        if (!$episode instanceof Episode)
        {
            throw new NotFoundHttpException(message: 'Episode not found or does not belong to the correct season.');
        }

        $existingEntity = $this->tracklistEpisodeRepository->findOneBy([
            'tracklistSeason' => $tracklistSeason,
            'episode' => $episode,
        ]);

        if ($existingEntity instanceof TracklistEpisode)
        {
            throw new ConflictHttpException(message: 'This episode is already added to the tracklist season.');
        }

        return [$tracklistSeason, $episode];
    }
}