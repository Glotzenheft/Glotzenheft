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