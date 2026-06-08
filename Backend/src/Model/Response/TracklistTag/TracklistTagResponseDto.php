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

readonly class TracklistTagResponseDto
{
    public function __construct(
        public int $id,
        public string $tagName,
        public string $tracklistTagType,
        public ?string $color,
        public ?string $description,
        public ?string $icon,
        public string $slug,
        public bool $isSpoiler,
        public bool $isAdult,
        public string $createdAt,
        public ?string $updatedAt,
        /**
         * @var array<TracklistTracklistTagResponseDto>
         */
        public array $tracklists
    ){}

    /**
     * @param TracklistTag $tag
     * @param array<TracklistTracklistTagResponseDto>|null $tracklistDtos
     * @return self
     */
    public static function fromEntity(
        TracklistTag $tag,
        ?array $tracklistDtos = null,
    ): self
    {
        if ($tracklistDtos === null)
        {
            $tracklistDtos = [];
            foreach ($tag->getTracklists() as $tracklist)
            {
                $tracklistDtos[] = TracklistTracklistTagResponseDto::fromEntity($tracklist);
            }
        }

        return new self(
            id: $tag->getId(),
            tagName: $tag->getTagName(),
            tracklistTagType: $tag->getTracklistTagType()->value,
            color: $tag->getColor(),
            description: $tag->getDescription(),
            icon: $tag->getIcon(),
            slug: $tag->getSlug(),
            isSpoiler: $tag->isSpoiler(),
            isAdult: $tag->isAdult(),
            createdAt: $tag->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $tag->getUpdatedAt()?->format('Y-m-d H:i:s'),
            tracklists: $tracklistDtos,
        );
    }
}