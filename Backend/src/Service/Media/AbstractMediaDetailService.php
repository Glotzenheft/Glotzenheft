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

namespace App\Service\Media;

use App\Entity\Media;
use App\Entity\User;
use App\Enum\MediaType;
use App\Model\Request\Media\MediaDetailDtoInterface;
use App\Model\Request\Media\MediaIdDto;
use App\Model\Response\Media\MediaDetailDataDto;
use App\Model\Response\Media\MediaResponseDto;
use App\Model\Response\Tracklist\TracklistResponseDto;
use App\Repository\MediaRepository;
use App\Repository\TracklistRepository;
use App\TmdbApi\ApiException;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class AbstractMediaDetailService
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
        protected MediaService           $mediaService,
        protected TracklistRepository    $tracklistRepository,
        protected MediaRepository        $mediaRepository,
    ){}

    /**
     * @param MediaDetailDtoInterface $dto
     * @param User $user
     * @return MediaResponseDto
     * @throws ApiException
     */
    public function getDetails(
        MediaDetailDtoInterface $dto,
        User $user,
    ): MediaResponseDto
    {
        $media = $this->findMedia($dto);
        if (!$media instanceof Media)
        {
            if ($dto->getTmdbId() === null)
            {
                throw new NotFoundHttpException('Media not found.');
            }
            $media = $this->mediaService->findOrCreateMedia(
                new MediaIdDto(
                    tmdbId: $dto->getTmdbId(),
                    mediaType: $this->getMediaType()->value,
                    language: $dto->getLanguage()
                )
            );
        }

        $this->updateMediaIfStale(
            media: $media,
            language: $dto->getLanguage()
        );

        $tracklists = $this->tracklistRepository->findTracklistsByUserAndMediaWithSeasonsEpisodesAndTags(
            user: $user,
            media: $media
        );

        $mediaDto = MediaDetailDataDto::fromEntity($media);

        $tracklistDtos = [];
        foreach ($tracklists as $tracklist)
        {
            $tracklistDtos[] = TracklistResponseDto::fromEntity($tracklist);
        }

        return new MediaResponseDto(
            media: $mediaDto,
            tracklists: $tracklistDtos
        );
    }

    /**
     * @return MediaType
     */
    abstract protected function getMediaType(): MediaType;

    /**
     * @param MediaDetailDtoInterface $dto
     * @return Media|null
     */
    private function findMedia(MediaDetailDtoInterface $dto): ?Media
    {
        if ($dto->getMediaId() !== null)
        {
            $media = $this->mediaRepository->findMediaWithSeasonsAndEpisodesById(
                id: $dto->getMediaId()
            );

            if ($media instanceof Media)
            {
                return $media;
            }
        }

        if ($dto->getTmdbId() !== null)
        {
            $media = $this->mediaRepository->findMediaWithSeasonsAndEpisodesByTmdbIdAndType(
                tmdbId: $dto->getTmdbId(),
                type: $this->getMediaType()->value
            );

            if ($media instanceof Media)
            {
                return $media;
            }
        }

        return null;
    }

    /**
     * @throws ApiException
     */
    private function updateMediaIfStale(Media $media, string $language): void
    {
        $lastUpdate = $media->getUpdatedAt();
        $now = new DateTimeImmutable();

        if (!$lastUpdate || ($now->getTimestamp() - $lastUpdate->getTimestamp()) > 300)
        {
            match ($this->getMediaType())
            {
                MediaType::TV => $this->mediaService->updateTvSeriesFromTmdb($media, $language),
                MediaType::Movie => $this->mediaService->updateMovieFromTmdb($media, $language),
            };

            $media->setUpdatedAt(new DateTimeImmutable());

            $this->entityManager->persist($media);
            $this->entityManager->flush();
        }
    }
}