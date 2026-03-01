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

namespace App\Model\Response\Media;

use App\Entity\Media;

readonly class MediaLightDetailResponseDto
{
    public function __construct(
        public int $id,
        public string $createdAt,
        public ?string $updatedAt,
        public ?string $posterPath,
        public string $type
    ){}

    /**
     * @param Media $media
     * @return self
     */
    public static function fromEntity(Media $media): self
    {
        return new self(
            id: $media->getId(),
            createdAt: $media->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $media->getUpdatedAt()?->format('Y-m-d H:i:s'),
            posterPath: $media->getPosterPath(),
            type: $media->getType()->value,
        );
    }
}