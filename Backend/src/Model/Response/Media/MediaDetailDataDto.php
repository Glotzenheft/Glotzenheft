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
use App\Model\Response\Media\Series\Season\SeasonDetailDataDto;
use App\Model\Response\TMDBGenre\TMDBGenreResponseDto;

readonly class MediaDetailDataDto
{
    public function __construct(
        public int     $id,
        public string  $createdAt,
        public ?string $updatedAt,
        public int     $tmdbId,
        public ?string $imdbId,
        public string  $originalName,
        public string  $name,
        public string  $description,
        public ?string $firstAirDate,
        public string  $type,
        public ?string $posterPath,
        public ?string $backdropPath,
        public ?int    $runtime,
        /**
         * @var SeasonDetailDataDto[]
         */
        public array   $seasons,
        /**
         * @var TMDBGenreResponseDto[]
         */
        public array   $tmdbGenres,
    ){}

    /**
     * @param Media $media
     * @param SeasonDetailDataDto[]|null $seasonDtos
     * @param TMDBGenreResponseDto[]|null $tmdbGenreDtos
     * @return self
     */
    public static function fromEntity(
        Media $media,
        ?array $seasonDtos = null,
        ?array $tmdbGenreDtos = null
    ): self
    {
        if ($seasonDtos === null)
        {
            $seasonDtos = [];
            if ($media->getType()->value !== 'movie')
            {
                foreach ($media->getSeasons() as $season)
                {
                    $seasonDtos[] = SeasonDetailDataDto::fromEntity($season);
                }
            }
        }

        if ($tmdbGenreDtos === null)
        {
            $tmdbGenreDtos = [];
            foreach ($media->getTmdbGenres() as $tmdbGenre)
            {
                $tmdbGenreDtos[] = TMDBGenreResponseDto::fromEntity($tmdbGenre);
            }
        }

        return new self(
            id: $media->getId(),
            createdAt: $media->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $media->getUpdatedAt()?->format('Y-m-d H:i:s'),
            tmdbId: $media->getTmdbId(),
            imdbId: $media->getImdbId(),
            originalName: $media->getOriginalName(),
            name: $media->getName(),
            description: $media->getDescription(),
            firstAirDate: $media->getFirstAirDate()?->format('Y-m-d'),
            type: $media->getType()->value,
            posterPath: $media->getPosterPath(),
            backdropPath: $media->getBackdropPath(),
            runtime: $media->getRuntime(),
            seasons: $seasonDtos,
            tmdbGenres: $tmdbGenreDtos,
        );
    }
}