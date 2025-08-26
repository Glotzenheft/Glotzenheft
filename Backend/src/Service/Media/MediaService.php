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

namespace App\Service\Media;

use App\Entity\Media;
use App\Entity\TMDBGenre;
use App\Enum\MediaType;
use App\Model\Request\Media\MediaIdDto;
use App\Service\TMDB\TVSeries\TVSeriesSeasonService;
use App\TmdbApi\Api\MoviesApi;
use App\TmdbApi\Api\TVApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\MovieDetails200Response;
use App\TmdbApi\Model\TvSeriesDetails200Response;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

readonly class MediaService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TVSeriesSeasonService $seasonService,
        private TVApi $tvApi,
        private MoviesApi $moviesApi,
    ){}

    /**
     * @param MediaIdDto $params
     * @return Media
     * @throws ApiException
     */
    public function findOrCreateMedia(MediaIdDto $params): Media
    {
        $mediaType = MediaType::tryFrom($params->mediaType);
        $media = $this->entityManager
            ->getRepository(Media::class)
            ->findOneBy([
                'tmdbID' => $params->tmdbId,
                'type' => $mediaType->value,
            ]);

        if ($media instanceof Media)
        {
            return $media;
        }

        return match ($mediaType)
        {
            MediaType::Movie => $this->createMovieFromTmdb($params->tmdbId, $params->language),
            MediaType::TV => $this->createTvSeriesFromTmdb($params->tmdbId, $params->language),
        };
    }

    /**
     * Updates a given movie entity with the latest data from TMDB.
     *
     * @param Media $media The entity to update.
     * @param string $language
     * @return Media The updated entity.
     * @throws ApiException
     */
    public function updateMovieFromTmdb(
        Media $media,
        string $language
    ): Media
    {
        $response = $this->moviesApi->movieDetails(
            movie_id: $media->getTmdbID(),
            append_to_response: 'external_ids',
            language: $language,
        );

        $this->populateMediaFromTmdbData(
            media: $media,
            tmdbData: $response,
            type: MediaType::Movie
        );

        $this->entityManager->persist($media);

        return $media;
    }

    /**
     * Updates a given TV series entity with the latest data from TMDB.
     *
     * @param Media $media The entity to update.
     * @param string $language
     * @return Media The updated entity.
     * @throws ApiException
     */
    public function updateTvSeriesFromTmdb(
        Media $media,
        string $language
    ): Media
    {
        $tvDetails = $this->tvApi->tvSeriesDetails(
            series_id: $media->getTmdbID(),
            append_to_response: 'external_ids',
            language: $language,
        );

        $this->populateMediaFromTmdbData(
            media: $media,
            tmdbData: $tvDetails,
            type: MediaType::TV
        );

        $this->entityManager->persist($media);

        if ($tvDetails->getNumberOfSeasons() > 0)
        {
            foreach ($tvDetails->getSeasons() as $season)
            {
                $seasonNumber = $season->getSeasonNumber();
                if ($seasonNumber !== null)
                {
                    $this->seasonService->updateSeasonFromTmdb(
                        media: $media,
                        seasonNumber: $seasonNumber,
                        language: $language,
                        flush: false
                    );
                }
            }
        }

        return $media;
    }

    /**
     * @param int $tmdbId
     * @param string $language
     * @return Media|null
     * @throws ApiException
     */
    private function createMovieFromTmdb(
        int $tmdbId,
        string $language
    ): ?Media
    {
        $media = (new Media())->setTmdbID($tmdbId);
        $this->updateMovieFromTmdb(
            media: $media,
            language: $language
        );
        $this->entityManager->flush();

        return $media;
    }

    /**
     * @param int $tmdbId
     * @param string $language
     * @return Media
     * @throws ApiException
     */
    private function createTvSeriesFromTmdb(
        int $tmdbId,
        string $language
    ): Media
    {
        $media = (new Media())->setTmdbID($tmdbId);
        $this->updateTvSeriesFromTmdb(
            media: $media,
            language: $language
        );
        $this->entityManager->flush();

        return $media;
    }

    /**
     * @param Media $media
     * @param MovieDetails200Response|TvSeriesDetails200Response $tmdbData
     * @param MediaType $type
     * @return void
     */
    private function populateMediaFromTmdbData(
        Media $media,
        MovieDetails200Response|TvSeriesDetails200Response $tmdbData,
        MediaType $type
    ): void
    {
        $firstAirDateStr = match ($type)
        {
            MediaType::Movie => $tmdbData->getReleaseDate(),
            MediaType::TV => $tmdbData->getFirstAirDate(),
        };

        $firstAirDate = !empty($firstAirDateStr)
            ? DateTime::createFromFormat('Y-m-d', $firstAirDateStr)
            : null;

        $name = ($type === MediaType::Movie)
            ? $tmdbData->getTitle()
            : $tmdbData->getName();

        $originalName = ($type === MediaType::Movie)
            ? $tmdbData->getOriginalTitle()
            : $tmdbData->getOriginalName();

        $imdbId = null;
        if (method_exists($tmdbData, 'getExternalIds')
            && $tmdbData->getExternalIds()
        )
        {
            $imdbId = $tmdbData->getExternalIds()->getImdbId();
        }
        elseif (method_exists($tmdbData, 'getImdbId'))
        {
            $imdbId = $tmdbData->getImdbId();
        }

        $runtime = null;
        if ($tmdbData instanceof MovieDetails200Response)
        {
            $runtime = $tmdbData->getRuntime();
        }
        elseif ($tmdbData instanceof TvSeriesDetails200Response
            && !empty($tmdbData->getEpisodeRunTime())
        )
        {
            $runtime = $tmdbData->getEpisodeRunTime()[0];
        }

        $media
            ->setName($name ?? '')
            ->setOriginalName($originalName ?? '')
            ->setDescription($tmdbData->getOverview() ?? '')
            ->setFirstAirDate($firstAirDate ?: null)
            ->setImdbID($imdbId)
            ->setPosterPath($tmdbData->getPosterPath())
            ->setBackdropPath($tmdbData->getBackdropPath())
            ->setType($type)
            ->setTmdbID($media->getTmdbID() ?? $tmdbData->getId())
            ->setRuntime($runtime)
            ->setUpdatedAt(new DateTimeImmutable());

        // Clear existing genres to replace them with the new ones
        $media->getTmdbGenres()->clear();
        foreach ($tmdbData->getGenres() ?? [] as $genreData)
        {
            $tmdbGenre = $this->entityManager->getRepository(TMDBGenre::class)->findOneBy([
                'tmdbGenreID' => $genreData->getId()]
            );
            if ($tmdbGenre instanceof TMDBGenre)
            {
                $media->addTmdbGenre($tmdbGenre);
            }
        }
    }
}