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
use App\Enum\TracklistStatus;

readonly class TracklistTracklistTagResponseDto
{
    public function __construct(
        public int $id,
        public string $tracklistName,
        public TracklistStatus $tracklistStatus,
        public ?int $tracklistRating,
        public ?string $tracklistCustomPosterPath,
        public ?string $tracklistCustomAirDate,
        public ?string $tracklistStartDateTime,
        public ? string $tracklistFinishDateTime,
        public int $mediaId,
        public string $mediaName,
        public string $mediaOriginalName,
        public ?string $mediaPosterPath,
        public ?string $mediaFirstAirDate,
        public MediaType $mediaType,
    ) {}

    public static function fromEntity(Tracklist $tracklist): self
    {
        $media = $tracklist->getMedia();
        return new self(
            id: $tracklist->getId(),
            tracklistName: $tracklist->getTracklistName(),
            tracklistStatus: $tracklist->getStatus(),
            tracklistRating: $tracklist->getRating(),
            tracklistCustomPosterPath: $tracklist->getCustomPosterPath(),
            tracklistCustomAirDate: $tracklist->getCustomAirDate()?->format('Y-m-d'),
            tracklistStartDateTime: $tracklist->getStartDate()?->format('Y-m-d H:i:s'),
            tracklistFinishDateTime: $tracklist->getFinishDate()?->format('Y-m-d H:i:s'),
            mediaId: $media?->getId(),
            mediaName: $media?->getName(),
            mediaOriginalName: $media?->getOriginalName(),
            mediaPosterPath: $media?->getPosterPath(),
            mediaFirstAirDate: $media?->getFirstAirDate()?->format('Y-m-d'),
            mediaType: $media?->getType(),
        );
    }
}