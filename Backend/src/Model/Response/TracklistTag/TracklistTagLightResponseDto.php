<?php

declare(strict_types=1);

namespace App\Model\Response\TracklistTag;

use App\Entity\TracklistTag;

class TracklistTagLightResponseDto
{
    public function __construct(
        public int $id,
        public string $tagName,
        public string $tracklistTagType,
        public ?string $color,
        public ?string $description,
        public ?string $icon,
        public ?string $slug,
        public bool $isSpoiler
    ){}

    public static function fromEntity(TracklistTag $tag): self
    {
        return new self(
            id: $tag->getId(),
            tagName: $tag->getTagName(),
            tracklistTagType: $tag->getTracklistTagType()->value,
            color: $tag->getColor(),
            description: $tag->getDescription(),
            icon: $tag->getIcon(),
            slug: $tag->getSlug(),
            isSpoiler: $tag->isSpoiler(),
        );
    }
}