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
use App\Model\Response\Tracklist\TracklistLightResponseDto;
use App\Repository\SeasonRepository;
use App\Repository\TracklistRepository;
use App\Service\Traits\EntityValidationTrait;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

readonly class TracklistService
{
    use EntityValidationTrait;

    public function __construct(
        private TracklistRepository $tracklistRepository,
        private SeasonRepository    $seasonRepository,
        private EntityManagerInterface $entityManager
    ){}

    /**
     * Get all tracklists of the user.
     *
     * @param User $user
     * @return array
     */
    public function getUserTracklists(User $user): array
    {
        $tracklists = $this->tracklistRepository->findAllTracklistsByUserWithMediaAndTags(
            user: $user
        );

        return array_map(
            fn(Tracklist $tracklist) => TracklistLightResponseDto::fromEntity(tracklist: $tracklist),
            $tracklists
        );
    }

    /**
     * Get tracklist entity based on its id.
     * Only returns the tracklist if the request is from the creator of the tracklist.
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
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );
    }

    /**
     * Creates a new tracklist for an existing user.
     * Returns the tracklist entity.
     * @param CreateTracklistDto $dto
     * @param User $user
     * @return TracklistLightResponseDto
     */
    public function createTracklist(
        CreateTracklistDto $dto,
        User $user
    ): TracklistLightResponseDto
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
            ->setIsRewatching($dto->isRewatching)
            ->setRating($dto->rating)
            ->setComment($dto->comment)
            ->setLanguage($dto->language)
            ->setSubtitle($dto->subtitle)
            ->setCustomPosterPath($dto->customPosterPath);

        $startDate = $dto->startDate
            ? DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dto->startDate)
            : null;
        $tracklist->setStartDate($startDate ?: null);

        $finishDate = $dto->finishDate
            ? DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dto->finishDate)
            : null;
        $tracklist->setFinishDate($finishDate ?: null);

        $customAirDate = $dto->customAirDate
            ? DateTimeImmutable::createFromFormat('Y-m-d', $dto->customAirDate)
            : null;
        $tracklist->setCustomAirDate($customAirDate ?: null);

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
            $tracklist->setTracklistSeason($tracklistSeason);
        }

        $this->entityManager->persist($tracklist);
        $this->entityManager->flush();

        return TracklistLightResponseDto::fromEntity($tracklist);
    }

    /**
     * @param int $tracklistId
     * @param UpdateTracklistDto $dto
     * @param User $user
     * @param array $requestData
     * @return TracklistLightResponseDto
     */
    public function updateTracklist(
        int $tracklistId,
        UpdateTracklistDto $dto,
        User $user,
        array $requestData
    ): TracklistLightResponseDto
    {
        $tracklist = $this->findAndValidateTracklist(
            tracklistId: $tracklistId,
            user: $user,
            tracklistRepository: $this->tracklistRepository
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
                ? DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dto->startDate)
                : null;
            $tracklist->setStartDate($startDate);
        }

        if (array_key_exists('tracklist_finish_date', $requestData))
        {
            $finishDate = $dto->finishDate
                ? DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dto->finishDate)
                : null;
            $tracklist->setFinishDate($finishDate);
        }

        if (array_key_exists('comment', $requestData))
        {
            $tracklist->setComment($dto->comment);
        }

        if (array_key_exists('custom_air_date', $requestData))
        {
            $customAirDate = $dto->customAirDate
                ? DateTimeImmutable::createFromFormat('Y-m-d', $dto->customAirDate)
                : null;
            $tracklist->setCustomAirDate($customAirDate);
        }

        if (array_key_exists('language', $requestData))
        {
            $tracklist->setLanguage($dto->language);
        }

        if (array_key_exists('subtitle', $requestData))
        {
            $tracklist->setSubtitle($dto->subtitle);
        }

        if (array_key_exists('custom_poster_path', $requestData))
        {
            $tracklist->setCustomPosterPath($dto->customPosterPath);
        }

        $tracklistSeason = $tracklist->getTracklistSeason();
        if ($tracklistSeason instanceof TracklistSeason)
        {
            $this->setTracklistSeasonProperties(
                tracklistSeason: $tracklistSeason,
                requestData: $requestData,
                dto: $dto
            );
        }

        $this->entityManager->flush();
        return TracklistLightResponseDto::fromEntity($tracklist);
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
            user: $user,
            tracklistRepository: $this->tracklistRepository
        );

        $this->entityManager->remove($tracklist);
        $this->entityManager->flush();
    }

    /**
     * @param TracklistSeason $tracklistSeason
     * @param array $requestData
     * @param UpdateTracklistDto $dto
     * @return void
     */
    private function setTracklistSeasonProperties(
        TracklistSeason $tracklistSeason,
        array $requestData,
        UpdateTracklistDto $dto
    ): void
    {
        if (array_key_exists('start_episode_number', $requestData))
        {
            $tracklistSeason->setStartEpisodeNumber($dto->startEpisodeNumber);
        }

        if (array_key_exists('end_episode_number', $requestData))
        {
            $tracklistSeason->setEndEpisodeNumber($dto->endEpisodeNumber);
        }

        if (array_key_exists('custom_season_number', $requestData))
        {
            $tracklistSeason->setCustomSeasonNumber($dto->customSeasonNumber);
        }

        if (array_key_exists('custom_part_number', $requestData))
        {
            $tracklistSeason->setCustomPartNumber($dto->customPartNumber);
        }
    }
}