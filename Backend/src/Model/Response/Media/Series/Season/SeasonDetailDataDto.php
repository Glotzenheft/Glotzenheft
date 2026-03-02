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

namespace App\Model\Response\Media\Series\Season;

use App\Entity\Season;
use App\Model\Response\Media\Series\Season\Episode\EpisodeDetailDataDto;

readonly class SeasonDetailDataDto
{
    public function __construct(
        public int $id,
        public string $createdAt,
        public ?string $updatedAt,
        public int $seasonNumber,
        public int $tmdbSeasonId,
        public string $name,
        public string $overview,
        public ?string $airDate,
        public int $episodeCount,
        public ?string $posterPath,
        /**
         * @var EpisodeDetailDataDto[]
         */
        public array $episodes,
    ){}

    /**
     * @param Season $season
     * @param EpisodeDetailDataDto[]|null $episodeDtos
     * @return self
     */
    public static function fromEntity(
        Season $season,
        ?array $episodeDtos = null
    ): self
    {
        if ( $episodeDtos === null)
        {
            $episodeDtos = [];
            foreach ($season->getEpisodes() as $episode)
            {
                $episodeDtos[] = EpisodeDetailDataDto::fromEntity($episode);
            }
        }

        return new self(
            id: $season->getId(),
            createdAt: $season->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $season->getUpdatedAt()?->format('Y-m-d H:i:s'),
            seasonNumber: $season->getSeasonNumber(),
            tmdbSeasonId: $season->getTmdbSeasonId(),
            name: $season->getName(),
            overview: $season->getOverview(),
            airDate: $season->getAirDate()?->format('Y-m-d'),
            episodeCount: $season->getEpisodeCount(),
            posterPath: $season->getPosterPath(),
            episodes: $episodeDtos,
        );
    }
}