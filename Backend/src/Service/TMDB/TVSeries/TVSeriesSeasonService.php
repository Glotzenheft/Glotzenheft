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

namespace App\Service\TMDB\TVSeries;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Model\Request\TV\TVSeasonDetailDto;
use App\Service\Traits\UpdateHelperTrait;
use App\TmdbApi\Api\TVApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\TvSeasonDetails200Response;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

readonly class TVSeriesSeasonService
{
    use UpdateHelperTrait;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private TVApi                  $tvApi,
        private LoggerInterface        $logger
    ){}

    /**
     * @param TVSeasonDetailDto $dto
     * @return TvSeasonDetails200Response
     * @throws ApiException
     */
    public function getSeasonDetails(TVSeasonDetailDto $dto): TvSeasonDetails200Response
    {
        return $this->tvApi->tvSeasonDetails(
            series_id: $dto->tmdbId,
            season_number: $dto->seasonNumber,
            append_to_response: $dto->appendToResponse,
            language: $dto->language,
        );
    }

    /**
     * Fetches season details from TMDB and updates or creates the Season and Episode entities.
     *
     * @param Media $media
     * @param int $seasonNumber
     * @param string $language
     * @param bool $flush
     * @return Season|null
     */
    public function updateOrCreateSeasonFromTmdb(
        Media  $media,
        int    $seasonNumber,
        string $language,
        bool   $flush = true
    ): ?Season
    {
        try
        {
            $response = $this->tvApi->tvSeasonDetails(
                series_id: $media->getTmdbID(),
                season_number: $seasonNumber,
                language: $language
            );

            $season = $this->entityManager->getRepository(Season::class)->findOneBy([
                'tmdbSeasonID' => $response->getId()
            ]);

            $isNewSeason = !$season instanceof Season;
            if ($isNewSeason)
            {
                $season = (new Season())
                    ->setMedia($media)
                    ->setTmdbSeasonID($response->getId())
                    ->setSeasonNumber($response->getSeasonNumber());
            }

            $isSeasonChanged = $isNewSeason;
            $this->setPropertyIfChanged(
                isChanged: $isSeasonChanged,
                setter: fn($v) => $season->setName($v),
                currentValue: $season->getName(),
                newValue: $response->getName() ?? '',
            );

            $this->setPropertyIfChanged(
                isChanged: $isSeasonChanged,
                setter: fn($v) => $season->setOverview($v),
                currentValue: $season->getOverview(),
                newValue: $response->getOverview() ?? '',
            );

            $this->setPropertyIfChanged(
                isChanged: $isSeasonChanged,
                setter: fn($v) => $season->setPosterPath($v),
                currentValue: $season->getPosterPath(),
                newValue: $response->getPosterPath()
            );

            $this->setPropertyIfChanged(
                isChanged: $isSeasonChanged,
                setter: fn($v) => $season->setEpisodeCount($v),
                currentValue: $season->getEpisodeCount(),
                newValue: count($response->getEpisodes())
            );

            $this->setPropertyIfChanged(
                isChanged: $isSeasonChanged,
                setter: fn($v) => $season->setAirDate($v),
                currentValue: $season->getAirDate(),
                newValue: $response->getAirDate()
                    ? DateTime::createFromFormat('!Y-m-d', $response->getAirDate())
                    : null
            );

            if ($isSeasonChanged)
            {
                $season->setUpdatedAt(new DateTimeImmutable());
                $this->entityManager->persist($season);
            }

            $existingEpisodes = [];
            if (!$isNewSeason)
            {
                $episodeIdsFromApi = array_map(fn($ep) => $ep->getId(), $response->getEpisodes());
                if (!empty($episodeIdsFromApi))
                {
                    $episodesFromDb = $this->entityManager->getRepository(Episode::class)
                        ->createQueryBuilder('e')
                        ->where('e.season = :season')
                        ->andWhere('e.tmdbEpisodeID IN (:ids)')
                        ->setParameter('season', $season)
                        ->setParameter('ids', $episodeIdsFromApi)
                        ->getQuery()
                        ->getResult();

                    foreach ($episodesFromDb as $episode)
                    {
                        $existingEpisodes[$episode->getTmdbEpisodeID()] = $episode;
                    }
                }
            }

            foreach ($response->getEpisodes() as $episodeData)
            {
                $episode = $existingEpisodes[$episodeData->getId()] ?? null;

                $isEpisodeChanged = !$episode instanceof Episode;
                if ($isEpisodeChanged)
                {
                    $episode = new Episode();
                    $season->addEpisode($episode);
                    $episode
                        ->setSeason($season)
                        ->setTmdbEpisodeID($episodeData->getId())
                        ->setEpisodeNumber($episodeData->getEpisodeNumber());
                }

                $this->setPropertyIfChanged(
                    isChanged: $isEpisodeChanged,
                    setter: fn($v) => $episode->setName($v),
                    currentValue: $episode->getName(),
                    newValue: $episodeData->getName() ?? '',
                );
                $this->setPropertyIfChanged(
                    isChanged: $isEpisodeChanged,
                    setter: fn($v) => $episode->setOverview($v),
                    currentValue: $episode->getOverview(),
                    newValue: $episodeData->getOverview() ?? '',
                );
                $this->setPropertyIfChanged(
                    isChanged: $isEpisodeChanged,
                    setter: fn($v) => $episode->setRuntime($v),
                    currentValue: $episode->getRuntime(),
                    newValue: $episodeData->getRuntime()
                );
                $this->setPropertyIfChanged(
                    isChanged: $isEpisodeChanged,
                    setter: fn($v) => $episode->setStillPath($v),
                    currentValue: $episode->getStillPath(),
                    newValue: $episodeData->getStillPath()
                );
                $this->setPropertyIfChanged(
                    isChanged: $isEpisodeChanged,
                    setter: fn($v) => $episode->setAirDate($v),
                    currentValue: $episode->getAirDate(),
                    newValue: $episodeData->getAirDate()
                        ? DateTime::createFromFormat('!Y-m-d', $episodeData->getAirDate())
                        : null
                );

                if ($isEpisodeChanged)
                {
                    $episode->setUpdatedAt(new DateTimeImmutable());
                    $this->entityManager->persist($episode);
                }
            }

            if ($flush) $this->entityManager->flush();

            return $season;
        }
        catch (ApiException $exception)
        {
            $this->logger->error($exception->getMessage());
            return null;
        }
    }
}