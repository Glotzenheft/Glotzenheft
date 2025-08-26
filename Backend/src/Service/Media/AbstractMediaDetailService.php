<?php declare(strict_types=1);

namespace App\Service\Media;

use App\Entity\Media;
use App\Entity\User;
use App\Enum\MediaType;
use App\Model\Request\Media\MediaDetailDtoInterface;
use App\Model\Request\Media\MediaIdDto;
use App\Repository\TracklistRepository;
use App\TmdbApi\ApiException;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

abstract class AbstractMediaDetailService
{
    public function __construct(
        protected EntityManagerInterface $entityManager,
        protected MediaService           $mediaService,
        protected TracklistRepository    $tracklistRepository
    ){}

    /**
     * @param MediaDetailDtoInterface $dto
     * @param int|null $userId
     * @return array{media: Media, tracklists: array}|array{error: string, code: int}
     * @throws ApiException
     */
    public function getDetails(MediaDetailDtoInterface $dto, ?int $userId): array
    {
        $media = $this->findMedia($dto);
        if (!$media instanceof Media)
        {
            if ($dto->getTmdbId() === null)
            {
                return [
                    'error' => 'Media not found.',
                    'code' => 404
                ];
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

        $tracklists = [];
        if ($userId)
        {
            $user = $this->entityManager->getRepository(User::class)->find($userId);
            if (!$user instanceof User)
            {
                return [
                    'error' => 'User not found.',
                    'code' => 404
                ];
            }
            $tracklists = $this->tracklistRepository->findByUserAndMediaWithSeasonsAndEpisodes($user, $media);
        }

        return [
            'media' => $media,
            'tracklists' => $tracklists,
        ];
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
        $repository = $this->entityManager->getRepository(Media::class);
        $criteria = [
            'type' => $this->getMediaType()
        ];

        if ($dto->getMediaId() !== null)
        {
            $criteria['id'] = $dto->getMediaId();
        }
        elseif ($dto->getTmdbId() !== null)
        {
            $criteria['tmdbID'] = $dto->getTmdbId();
        }
        else
        {
            return null;
        }

        return $repository->findOneBy($criteria);
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
            $this->entityManager->flush();
        }
    }
}