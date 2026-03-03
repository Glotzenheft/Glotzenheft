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
use App\Model\Response\Media\MediaLightDetailResponseDto;
use App\Model\Response\TracklistTag\TracklistTagLightResponseDto;
use App\Model\Response\TracklistTag\TracklistTagResponseDto;

readonly class TracklistLightResponseDto
{
    public function __construct(
        public int     $id,
        public string  $tracklistName,
        public string  $createdAt,
        public ?string $updatedAt,
        public string  $status,
        public ?int    $rating,
        public bool    $isRewatching,
        public ?string $startDate,
        public ?string $finishDate,
        public MediaLightDetailResponseDto $media,
        /**
         * @var TracklistTagResponseDto[]
         */
        public array   $tags,
    ){}

    /**
     * @param Tracklist $tracklist
     * @param MediaLightDetailResponseDto|null $mediaDto
     * @param array|null $tagDtos
     * @return self
     */
    public static function fromEntity(
        Tracklist $tracklist,
        ?MediaLightDetailResponseDto $mediaDto = null,
        ?array $tagDtos = null,
    ): self
    {
        if ($mediaDto === null)
        {
            $mediaDto = MediaLightDetailResponseDto::fromEntity($tracklist->getMedia());
        }

        if ($tagDtos === null)
        {
            $tagDtos = [];
            foreach ($tracklist->getTracklistTags() as $tag)
            {
                $tagDtos[] = TracklistTagLightResponseDto::fromEntity($tag);
            }
        }

        return new self(
            id: $tracklist->getId(),
            tracklistName: $tracklist->getTracklistName(),
            createdAt: $tracklist->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $tracklist->getUpdatedAt()->format('Y-m-d H:i:s'),
            status: $tracklist->getStatus()->value,
            rating: $tracklist->getRating(),
            isRewatching: $tracklist->isRewatching(),
            startDate: $tracklist->getStartDate()?->format('Y-m-d'),
            finishDate: $tracklist->getFinishDate()?->format('Y-m-d'),
            media: $mediaDto,
            tags: $tagDtos,
        );
    }
}