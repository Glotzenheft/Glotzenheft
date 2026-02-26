<?php declare(strict_types=1);

namespace App\Model\Response\TracklistTag;

use App\Entity\Tracklist;

readonly class TracklistTracklistTagResponseDto
{
    public function __construct(
        public int $id,
        public string $tracklistName,
    ) {}

    public static function fromEntity(Tracklist $tracklist): self
    {
        return new self(
            id: $tracklist->getId(),
            tracklistName: $tracklist->getTracklistName(),
        );
    }
}