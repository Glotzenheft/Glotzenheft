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

use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Model\Request\Tracklist\CreateTracklistDto;
use App\Model\Request\Tracklist\UpdateTracklistDto;
use App\Service\RequestTrait;
use DateTime;
use DateTimeImmutable;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class TracklistService
{
    use RequestTrait;

    /**
     * Get all tracklists of the user.
     *
     * @param User $user
     * @return array
     */
    public function getUserTracklists(User $user): array
    {
        return $user->getTracklists()->toArray();
    }

    /**
     * Get tracklist entity based on its id.
     * Only returns the tracklist, if the request is from the creator of the tracklist.
     *
     * @param int $tracklistId
     * @param User $user
     * @return Tracklist
     */
    public function getTracklist(
        int $tracklistId,
        User $user
    ): Tracklist
    {
        return $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user
        );
    }

    /**
     * Creates a new tracklist for an existing user.
     * Returns the tracklist entity.
     * @param CreateTracklistDto $dto
     * @param User $user
     * @return Tracklist
     */
    public function createTracklist(
        CreateTracklistDto $dto,
        User $user
    ): Tracklist
    {
        $media = $this->entityManager
            ->getRepository(Media::class)
            ->find($dto->mediaId);
        if (!$media)
        {
            throw new NotFoundHttpException(message: 'Media not found');
        }

        $tracklist = (new Tracklist())
            ->setTracklistName($dto->tracklistName)
            ->setUser($user)
            ->setStatus($dto->tracklistStatus)
            ->setMedia($media)
            ->setIsRewatching($dto->isRewatching);

        $this->setOptionalTracklistProperties(
            tracklist: $tracklist,
            rating: $dto->rating,
            startDateStr: $dto->startDate,
            finishDateStr: $dto->finishDate
        );

        if ($dto->mediaType === 'tv')
        {
            $season = $this->entityManager
                ->getRepository(Season::class)
                ->find($dto->seasonId);
            if (!$season instanceof Season)
            {
                throw new NotFoundHttpException(message: 'Season not found');
            }
            if ($season->getMedia()->getId() !== $media->getId())
            {
                throw new ConflictHttpException(message: 'Provided season_id does not belong to the media_id.');
            }

            $tracklistSeason = (new TracklistSeason())
                ->setSeason($season)
                ->setTracklist($tracklist);
            $this->entityManager->persist($tracklistSeason);
            $tracklist->addTracklistSeason($tracklistSeason);
        }

        $this->entityManager->persist($tracklist);
        $this->entityManager->flush();

        return $tracklist;
    }

    /**
     * @param UpdateTracklistDto $dto
     * @param User $user
     * @param array $requestData
     * @return Tracklist
     */
    public function updateTracklist(
        UpdateTracklistDto $dto,
        User $user,
        array $requestData
    ): Tracklist
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $dto->tracklistId,
            user: $user
        );

        if (array_key_exists('tracklist_name', $requestData)
            && $dto->tracklistName !== null
            && trim($dto->tracklistName) !== ''
        )
        {
            $tracklist->setTracklistName($dto->tracklistName);
        }

        if (array_key_exists('tracklist_status', $requestData)
            && $dto->tracklistStatus !== null
        )
        {
            $tracklist->setStatus($dto->tracklistStatus);
        }

        if (array_key_exists('is_rewatching', $requestData)
            && $dto->isRewatching !== null
        )
        {
            $tracklist->setIsRewatching($dto->isRewatching);
        }

        if (array_key_exists('tracklist_rating', $requestData))
        {
            $tracklist->setRating($dto->rating);
        }

        if (array_key_exists('tracklist_start_date', $requestData))
        {
            $startDate = $dto->startDate
                ? DateTime::createFromFormat('Y-m-d', $dto->startDate)
                : null;
            $tracklist->setStartDate($startDate);
        }

        if (array_key_exists('tracklist_finish_date', $requestData))
        {
            $finishDate = $dto->finishDate
                ? DateTime::createFromFormat('Y-m-d', $dto->finishDate)
                : null;
            $tracklist->setFinishDate($finishDate);
        }

        $tracklist->setUpdatedAt(new DateTimeImmutable());
        $this->entityManager->flush();
        return $tracklist;
    }

    /**
     * @param int $tracklistId
     * @param User $user
     * @return void
     */
    public function deleteTracklist(
        int $tracklistId,
        User $user
    ): void
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user
        );

        $this->entityManager->remove($tracklist);
        $this->entityManager->flush();
    }

    /**
     * @param Tracklist $tracklist
     * @param int|null $rating
     * @param string|null $startDateStr
     * @param string|null $finishDateStr
     * @return void
     */
    private function setOptionalTracklistProperties(
        Tracklist $tracklist,
        ?int $rating,
        ?string $startDateStr,
        ?string $finishDateStr
    ): void
    {
        $tracklist->setRating($rating);

        $startDate = $startDateStr
            ? DateTime::createFromFormat('Y-m-d', $startDateStr)
            : null;
        $tracklist->setStartDate($startDate ?: null);

        $finishDate = $finishDateStr
            ? DateTime::createFromFormat('Y-m-d', $finishDateStr)
            : null;
        $tracklist->setFinishDate($finishDate ?: null);

        $tracklist->setUpdatedAt(new DateTimeImmutable());
    }

    /**
     * @param int $tracklistId
     * @param User $user
     * @return Tracklist
     */
    private function findAndValidateTracklist(
        int $tracklistId,
        User $user
    ): Tracklist
    {
        $tracklist = $this->entityManager
            ->getRepository(Tracklist::class)
            ->find($tracklistId);

        if (!$tracklist)
        {
            throw new NotFoundHttpException('Tracklist not found');
        }

        if ($tracklist->getUser() !== $user)
        {
            throw new UnauthorizedHttpException('Bearer', 'User is not authorized to access this tracklist.');
        }

        return $tracklist;
    }
}