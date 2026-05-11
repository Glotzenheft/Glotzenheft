<?php

declare(strict_types=1);

namespace App\Model\Response\Tracklist\Search;

use App\Entity\Media;
use App\Entity\Tracklist;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

readonly class TracklistSearchResponseDto
{
    public function __construct(
        public int $id,
        public string $tracklistName,
        public string $mediaName,
        public string $mediaOriginalName,
        public string $mediaType,
        public ?int $seasonNumber,
        public ?int $customSeasonNumber,
    ) {}

    public static function fromEntity(
        Tracklist $tracklist
    ): self
    {
        $media = $tracklist->getMedia();
        if (!$media instanceof Media)
        {
            throw new UnprocessableEntityHttpException('Internal Server Error');
        }

        return new self(
            id: $tracklist->getId(),
            tracklistName: $tracklist->getTracklistName(),
            mediaName: $tracklist->getMedia()->getName(),
            mediaOriginalName: $tracklist->getMedia()->getOriginalName(),
            mediaType: $media->getType()?->value ?? 'unknown',
            seasonNumber: $tracklist->getTracklistSeason()?->getSeason()?->getSeasonNumber(),
            customSeasonNumber: $tracklist->getTracklistSeason()?->getCustomSeasonNumber()
        );
    }
}