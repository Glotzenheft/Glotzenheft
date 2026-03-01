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

namespace App\Model\Response\Tracklist\TracklistSeason;

use App\Entity\TracklistSeason;
use App\Model\Response\Media\Series\Season\SeasonLightDetailDataDto;
use App\Model\Response\Tracklist\TracklistSeason\TracklistEpisode\TracklistEpisodeDetailDataDto;
use Symfony\Component\Serializer\Attribute\SerializedName;

readonly class TracklistSeasonDetailDataDto
{
    public function __construct(
        public int $id,
        public string $createdAt,
        public ?string $updatedAt,
        #[SerializedName('season')]
        public SeasonLightDetailDataDto $seasonDto,
        /**
         * @var TracklistEpisodeDetailDataDto[]
         */
        public array $tracklistEpisodesDtos,
    ){}

    /**
     * @param TracklistSeason $tracklistSeason
     * @param SeasonLightDetailDataDto|null $seasonDto
     * @param TracklistEpisodeDetailDataDto[]|null $tracklistEpisodeDtos
     * @return self
     */
    public static function fromEntity(
        TracklistSeason $tracklistSeason,
        ?SeasonLightDetailDataDto $seasonDto = null,
        ?array $tracklistEpisodeDtos = null,
    ): self
    {
        if ($seasonDto === null)
        {
            $seasonDto = SeasonLightDetailDataDto::fromEntity($tracklistSeason->getSeason());
        }

        if ( $tracklistEpisodeDtos === null)
        {
            $tracklistEpisodeDtos = [];
            foreach ($tracklistSeason->getTracklistEpisodes() as $tracklistEpisode)
            {
                $tracklistEpisodeDtos[] = TracklistEpisodeDetailDataDto::fromEntity($tracklistEpisode);
            }
        }

        return new self(
            id: $tracklistSeason->getId(),
            createdAt: $tracklistSeason->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $tracklistSeason->getUpdatedAt()->format('Y-m-d H:i:s'),
            seasonDto: $seasonDto,
            tracklistEpisodesDtos: $tracklistEpisodeDtos,
        );
    }
}