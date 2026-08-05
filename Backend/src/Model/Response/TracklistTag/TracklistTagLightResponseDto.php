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

namespace App\Model\Response\TracklistTag;

use App\Entity\TracklistTag;
use App\Enum\TracklistTagType;
use UnexpectedValueException;

class TracklistTagLightResponseDto
{
    public function __construct(
        public int $id,
        public string $tagName,
        public TracklistTagType $tracklistTagType,
        public ?string $color,
        public ?string $description,
        public ?string $icon,
        public string $slug,
        public bool $isSpoiler,
        public bool $isAdult,
        public string $createdAt,
        public ?string $updatedAt,
    ){}

    /**
     * @param TracklistTag $tag
     * @return self
     */
    public static function fromEntity(TracklistTag $tag): self
    {
        return new self(
            id: $tag->getId() ?? throw new UnexpectedValueException('TracklistTag Id cannot be null'),
            tagName: $tag->getTagName()  ?? throw new UnexpectedValueException('TracklistTag name cannot be null'),
            tracklistTagType: $tag->getTracklistTagType() ?? throw new UnexpectedValueException('TracklistTag type cannot be null'),
            color: $tag->getColor(),
            description: $tag->getDescription(),
            icon: $tag->getIcon(),
            slug: $tag->getSlug() ?? throw new UnexpectedValueException('TracklistTag slug cannot be null'),
            isSpoiler: $tag->isSpoiler() ?? throw new UnexpectedValueException('TracklistTag spoiler value cannot be null'),
            isAdult: $tag->isAdult() ?? throw new UnexpectedValueException('TracklistTag adult value cannot be null'),
            createdAt: $tag->getCreatedAt()?->format('Y-m-d H:i:s') ?? throw new UnexpectedValueException('TracklistTag creation date cannot be null'),
            updatedAt: $tag->getUpdatedAt()?->format('Y-m-d H:i:s'),
        );
    }
}