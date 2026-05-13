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
use UnexpectedValueException;

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
        public ?string $tracklistFinishDateTime,
        public ?string $tracklistLanguage,
        public ?string $tracklistSubtitle,
        public ?int $tracklistSeasonCustomSeasonNumber,
        public ?int $tracklistSeasonCustomPartNumber,
        public ?int $tracklistSeasonFirstEpisodeNumber,
        public ?int $tracklistSeasonLastEpisodeNumber,
        public int $mediaId,
        public string $mediaName,
        public string $mediaOriginalName,
        public ?string $mediaPosterPath,
        public ?string $mediaFirstAirDate,
        public MediaType $mediaType,
        public ?int $mediaSeasonNumber,
        public ?string $mediaSeasonAirDate,
        public ?int $mediaSeasonEpisodeCount,
        public ?string $mediaSeasonPosterPath,
        public ?int $watchedEpisodes,
    ) {}

    /**#
     * @param Tracklist $tracklist
     * @param int|null $watchedEpisodes
     * @return self
     */
    public static function fromEntity(
        Tracklist $tracklist,
        ?int $watchedEpisodes = null
    ): self
    {
        $media = $tracklist->getMedia() ?? throw new UnexpectedValueException('Tracklist media cannot be null');
        $tracklistSeason = $tracklist->getTracklistSeason();
        $mediaSeason = $tracklistSeason?->getSeason();

        return new self(
            id: $tracklist->getId() ?? throw new UnexpectedValueException('Tracklist Id cannot be null'),
            tracklistName: $tracklist->getTracklistName() ?? throw new UnexpectedValueException('Tracklist name cannot be null'),
            tracklistStatus: $tracklist->getStatus() ?? throw new UnexpectedValueException('Tracklist status cannot be null'),
            tracklistRating: $tracklist->getRating(),
            tracklistCustomPosterPath: $tracklist->getCustomPosterPath(),
            tracklistCustomAirDate: $tracklist->getCustomAirDate()?->format('Y-m-d'),
            tracklistStartDateTime: $tracklist->getStartDate()?->format('Y-m-d H:i:s'),
            tracklistFinishDateTime: $tracklist->getFinishDate()?->format('Y-m-d H:i:s'),
            tracklistLanguage: $tracklist->getLanguage(),
            tracklistSubtitle: $tracklist->getSubtitle(),
            tracklistSeasonCustomSeasonNumber: $tracklistSeason?->getCustomSeasonNumber(),
            tracklistSeasonCustomPartNumber: $tracklistSeason?->getCustomPartNumber(),
            tracklistSeasonFirstEpisodeNumber: $tracklistSeason?->getStartEpisodeNumber(),
            tracklistSeasonLastEpisodeNumber: $tracklistSeason?->getEndEpisodeNumber(),
            mediaId: $media->getId() ?? throw new UnexpectedValueException('Media Id cannot be null'),
            mediaName: $media->getName() ?? throw new UnexpectedValueException('Media name cannot be null'),
            mediaOriginalName: $media->getOriginalName() ?? throw new UnexpectedValueException('Media original name cannot be null'),
            mediaPosterPath: $media->getPosterPath(),
            mediaFirstAirDate: $media->getFirstAirDate()?->format('Y-m-d'),
            mediaType: $media->getType() ?? throw new UnexpectedValueException('Media type cannot be null'),
            mediaSeasonNumber: $mediaSeason?->getSeasonNumber(),
            mediaSeasonAirDate: $mediaSeason?->getAirDate()?->format('Y-m-d'),
            mediaSeasonEpisodeCount: $mediaSeason?->getEpisodeCount(),
            mediaSeasonPosterPath: $mediaSeason?->getPosterPath(),
            watchedEpisodes: $watchedEpisodes,
        );
    }
}