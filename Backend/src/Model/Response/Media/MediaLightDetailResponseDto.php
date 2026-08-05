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
use App\Enum\MediaType;
use UnexpectedValueException;

readonly class MediaLightDetailResponseDto
{
    public function __construct(
        public int $id,
        public string $createdAt,
        public ?string $updatedAt,
        public ?string $posterPath,
        public MediaType $type
    ){}

    /**
     * @param Media $media
     * @return self
     */
    public static function fromEntity(Media $media): self
    {
        return new self(
            id: $media->getId() ?? throw new UnexpectedValueException('Media Id cannot be null'),
            createdAt: $media->getCreatedAt()?->format('Y-m-d H:i:s') ?? throw new UnexpectedValueException('Media creation date cannot be null'),
            updatedAt: $media->getUpdatedAt()?->format('Y-m-d H:i:s'),
            posterPath: $media->getPosterPath(),
            type: $media->getType() ?? throw new UnexpectedValueException('Media type cannot be null'),
        );
    }
}