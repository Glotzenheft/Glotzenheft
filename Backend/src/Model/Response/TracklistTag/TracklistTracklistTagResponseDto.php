<?php declare(strict_types=1);

namespace App\Model\Response\TracklistTag;

use App\Entity\Tracklist;
use App\Enum\MediaType;

readonly class TracklistTracklistTagResponseDto
{
    public function __construct(
        public int $id,
        public string $tracklistName,
        public int $mediaId,
        public string $mediaName,
        public string $mediaOriginalName,
        public string $mediaPosterPath,
        public MediaType $mediaType,
    ) {}

    public static function fromEntity(Tracklist $tracklist): self
    {
        $media = $tracklist->getMedia();
        return new self(
            id: $tracklist->getId(),
            tracklistName: $tracklist->getTracklistName(),
            mediaId: $media?->getId(),
            mediaName: $media?->getName(),
            mediaOriginalName: $media?->getOriginalName(),
            mediaPosterPath: $media?->getPosterPath(),
            mediaType: $media?->getType(),
        );
    }
}