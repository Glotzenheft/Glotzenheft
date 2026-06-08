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

namespace App\Model\Response\Tracklist\Search;

use App\Entity\Media;
use App\Entity\Tracklist;
use UnexpectedValueException;

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
            throw new UnexpectedValueException(sprintf('Tracklist with ID %d has no associated media.', $tracklist->getId()));
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