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

namespace App\Model\Response\Tracklist;

use App\Entity\Tracklist;
use App\Enum\TracklistStatus;
use App\Model\Response\Media\MediaLightDetailResponseDto;
use App\Model\Response\TracklistTag\TracklistTagLightResponseDto;
use UnexpectedValueException;

readonly class TracklistLightResponseDto
{
    public function __construct(
        public int     $id,
        public string  $tracklistName,
        public string  $createdAt,
        public ?string $updatedAt,
        public TracklistStatus  $status,
        public ?int    $rating,
        public bool    $isRewatching,
        public ?string $startDate,
        public ?string $finishDate,
        public ?string $customAirDate,
        public ?string $language,
        public ?string $subtitle,
        public ?string $customPosterPath,
        public MediaLightDetailResponseDto $media,
        /**
         * @var array<TracklistTagLightResponseDto>
         */
        public array   $tags,
    ){}

    /**
     * @param Tracklist $tracklist
     * @param MediaLightDetailResponseDto|null $mediaDto
     * @param array<TracklistTagLightResponseDto>|null $tagDtos
     * @return self
     */
    public static function fromEntity(
        Tracklist $tracklist,
        ?MediaLightDetailResponseDto $mediaDto = null,
        ?array $tagDtos = null,
    ): self
    {
        $media = $tracklist->getMedia() ?? throw new UnexpectedValueException('Tracklist media cannot be null');
        if ($mediaDto === null)
        {
            $mediaDto = MediaLightDetailResponseDto::fromEntity($media);
        }

        $tagDtos = $tagDtos ?? $tracklist->getTracklistTags()->map(
            fn($tag) => TracklistTagLightResponseDto::fromEntity($tag)
        )->toArray();

        return new self(
            id: $tracklist->getId() ?? throw new UnexpectedValueException('Tracklist Id cannot be null'),
            tracklistName: $tracklist->getTracklistName() ?? throw new UnexpectedValueException('Tracklist name cannot be null'),
            createdAt: $tracklist->getCreatedAt()?->format('Y-m-d H:i:s') ?? throw new UnexpectedValueException('Tracklist creation date cannot be null'),
            updatedAt: $tracklist->getUpdatedAt()?->format('Y-m-d H:i:s'),
            status: $tracklist->getStatus() ?? throw new UnexpectedValueException('Tracklist status cannot be null'),
            rating: $tracklist->getRating(),
            isRewatching: $tracklist->isRewatching() ?? throw new UnexpectedValueException('Tracklist is rewatching status cannot be null'),
            startDate: $tracklist->getStartDate()?->format('Y-m-d H:i:s'),
            finishDate: $tracklist->getFinishDate()?->format('Y-m-d H:i:s'),
            customAirDate: $tracklist->getCustomAirDate()?->format('Y-m-d'),
            language: $tracklist->getLanguage(),
            subtitle: $tracklist->getSubtitle(),
            customPosterPath: $tracklist->getCustomPosterPath(),
            media: $mediaDto,
            tags: $tagDtos,
        );
    }
}