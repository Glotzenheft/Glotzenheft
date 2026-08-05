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
use App\Entity\Season;
use App\Entity\TMDBGenre;
use App\Enum\MediaType;
use App\Model\Response\Media\Series\Season\SeasonDetailDataDto;
use App\Model\Response\TMDBGenre\TMDBGenreResponseDto;
use UnexpectedValueException;

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
        public MediaType  $type,
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
        $mediaType = $media->getType() ?? throw new UnexpectedValueException('Media type cannot be null');
        $seasonDtos = $seasonDtos ?? ($mediaType === MediaType::TV
            ? $media->getSeasons()->map(
                fn(Season $season) => SeasonDetailDataDto::fromEntity($season)
            )->toArray()
            : []
        );

        $tmdbGenreDtos = $tmdbGenreDtos ?? $media->getTmdbGenres()->map(
            fn(TMDBGenre $tmdbGenre) => TMDBGenreResponseDto::fromEntity($tmdbGenre)
        )->toArray();

        return new self(
            id: $media->getId() ?? throw new UnexpectedValueException('Media Id cannot be null'),
            createdAt: $media->getCreatedAt()?->format('Y-m-d H:i:s') ?? throw new UnexpectedValueException('Media creation date cannot be null'),
            updatedAt: $media->getUpdatedAt()?->format('Y-m-d H:i:s'),
            tmdbId: $media->getTmdbId() ?? throw new UnexpectedValueException('TMDB Id cannot be null'),
            imdbId: $media->getImdbId(),
            originalName: $media->getOriginalName() ?? throw new UnexpectedValueException('Media original name cannot be null'),
            name: $media->getName() ?? throw new UnexpectedValueException('Media name cannot be null'),
            description: $media->getDescription() ?? throw new UnexpectedValueException('Media description cannot be null'),
            firstAirDate: $media->getFirstAirDate()?->format('Y-m-d'),
            type: $mediaType,
            posterPath: $media->getPosterPath(),
            backdropPath: $media->getBackdropPath(),
            runtime: $media->getRuntime(),
            seasons: $seasonDtos,
            tmdbGenres: $tmdbGenreDtos,
        );
    }
}