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
use App\Enum\MediaType;
use UnexpectedValueException;

readonly class TracklistSearchResponseDto
{
    public function __construct(
        public int $id,
        public string $tracklistName,
        public string $mediaName,
        public string $mediaOriginalName,
        public MediaType $mediaType,
        public ?int $seasonNumber,
        public ?int $customSeasonNumber,
    ) {}

    /**
     * @param Tracklist $tracklist
     * @return self
     */
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
            id: $tracklist->getId() ?? throw new UnexpectedValueException('Tracklist Id cannot be null'),
            tracklistName: $tracklist->getTracklistName() ?? throw new UnexpectedValueException('Tracklist name cannot be null'),
            mediaName: $media->getName() ?? throw new UnexpectedValueException('Media name cannot be null'),
            mediaOriginalName: $media->getOriginalName() ?? throw new UnexpectedValueException('Media original name cannot be null'),
            mediaType: $media->getType() ?? throw new UnexpectedValueException('Media type cannot be null'),
            seasonNumber: $tracklist->getTracklistSeason()?->getSeason()?->getSeasonNumber(),
            customSeasonNumber: $tracklist->getTracklistSeason()?->getCustomSeasonNumber()
        );
    }
}