<?php declare(strict_types=1);

namespace App\API\TheMovieDB\TVSeries\SeasonDetails;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class TMDBTVSeasonDetailsService implements TMDBTVSeasonDetailsInterface
{
    public function __construct
    (
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_TV_SERIES_DETAILS_URL)%')]
        private string $apiUrl,
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger,
        private EntityManagerInterface $entityManager
    )
    {
    }

    public function getTVSeasonDetails(int $seriesID, int $seasonNumber, string $language = 'de-DE'): array
    {
        try
        {
            $response = $this->httpClient->request('GET', $this->apiUrl . $seriesID . '/season/' . $seasonNumber . '?language=' . $language, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->tmdbToken,
                    'accept' => 'application/json',
                ]
            ]);

            return json_decode($response->getContent(), true);
        }
        catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e)
        {
            $this->logger->error($e->getMessage());
            return [];
        }
    }

    public function handleSeasonDetails(int $seriesID, int $seasonNumber, Media $media, string $language = 'de-DE'): Season
    {
        $response = $this->getTVSeasonDetails($seriesID, $seasonNumber, $language);
        $tmdbSeasonID = $response['id'];
        $name = $response['name'];
        $overview = $response['overview'];
        $seasonNumber = $response['season_number'];
        $airDate = DateTime::createFromFormat('Y-m-d', $response['air_date']);
        $episodeCount = count($response['episodes']);
        $postPath = $response['poster_path'];
        $episodes = $response['episodes'];

        $season = $this->entityManager->getRepository(Season::class)->findOneBy(['tmdbSeasonID' => $tmdbSeasonID]);

        if (!$season instanceof Season)
        {
            $season = new Season();
        }

        $season
            ->setMedia($media)
            ->setTmdbSeasonID($tmdbSeasonID)
            ->setSeasonNumber($seasonNumber)
            ->setName($name)
            ->setOverview($overview)
            ->setAirDate($airDate)
            ->setEpisodeCount($episodeCount)
            ->setPosterPath($postPath)
        ;

        $this->entityManager->persist($season);

        foreach ($episodes as $singleEpisode)
        {
            $tmdbEpisodeID = $singleEpisode['id'];
            $name = $singleEpisode['name'];
            $overview = $singleEpisode['overview'];
            $episodeNumber = (int) $singleEpisode['episode_number'];
            $runtime = (int) $singleEpisode['runtime'];
            $stillPath = $singleEpisode['still_path'];
            $airDate = DateTime::createFromFormat('Y-m-d', $singleEpisode['air_date']);

            $episode = $this->entityManager->getRepository(Episode::class)->findOneBy([
                'tmdbEpisodeID' => $tmdbEpisodeID,
                'episodeNumber' => $episodeNumber,
            ]);

            if (!$episode instanceof Episode)
            {
                $episode = new Episode();
                $season->addEpisode($episode);
            }

            $episode
                ->setSeason($season)
                ->setName($name)
                ->setOverview($overview)
                ->setEpisodeNumber($episodeNumber)
                ->setRuntime($runtime)
                ->setStillPath($stillPath)
                ->setAirDate($airDate)
                ->setTmdbSeasonID($tmdbEpisodeID)
            ;

            $this->entityManager->persist($episode);
        }

        $this->entityManager->flush();

        return $season;
    }
}