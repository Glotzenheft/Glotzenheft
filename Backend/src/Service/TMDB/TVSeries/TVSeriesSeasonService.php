<?php declare(strict_types=1);

namespace App\Service\TMDB\TVSeries;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Model\Request\TV\TVSeasonDetailDto;
use App\TmdbApi\Api\TVApi;
use App\TmdbApi\ApiException;
use App\TmdbApi\Model\TvSeasonDetails200Response;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;

readonly class TVSeriesSeasonService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private TVApi                  $tvApi,
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
     * @throws ApiException
     */
    public function updateSeasonFromTmdb(
        Media  $media,
        int    $seasonNumber,
        string $language,
        bool   $flush = true
    ): Season
    {
        $response = $this->tvApi->tvSeasonDetails(
            series_id: $media->getTmdbID(),
            season_number: $seasonNumber,
            language: $language
        );

        $season = $this->entityManager->getRepository(Season::class)->findOneBy([
            'tmdbSeasonID' => $response->getId()
        ]);

        if (!$season instanceof Season)
        {
            $season = new Season();
        }

        $airDate = $response->getAirDate();
        $season
            ->setMedia($media)
            ->setTmdbSeasonID($response->getId())
            ->setSeasonNumber($response->getSeasonNumber())
            ->setName($response->getName())
            ->setOverview($response->getOverview())
            ->setAirDate($airDate ? DateTime::createFromFormat('Y-m-d', $airDate) : null)
            ->setEpisodeCount(count($response->getEpisodes()))
            ->setPosterPath($response->getPosterPath())
            ->setUpdatedAt(new DateTimeImmutable());

        $this->entityManager->persist($season);

        foreach ($response->getEpisodes() as $episodeData)
        {
            $episode = $this->entityManager->getRepository(Episode::class)->findOneBy([
                'tmdbEpisodeID' => $episodeData->getId(),
            ]);

            if (!$episode instanceof Episode)
            {
                $episode = new Episode();
                $season->addEpisode($episode);
            }

            $episodeAirDate = $episodeData->getAirDate();
            $episode
                ->setSeason($season)
                ->setName($episodeData->getName())
                ->setOverview($episodeData->getOverview())
                ->setEpisodeNumber($episodeData->getEpisodeNumber())
                ->setRuntime($episodeData->getRuntime())
                ->setStillPath($episodeData->getStillPath())
                ->setAirDate($episodeAirDate ? DateTime::createFromFormat('Y-m-d', $episodeAirDate) : null)
                ->setTmdbEpisodeID($episodeData->getId())
                ->setUpdatedAt(new DateTimeImmutable());

            $this->entityManager->persist($episode);
        }

        if ($flush) $this->entityManager->flush();

        return $season;
    }
}