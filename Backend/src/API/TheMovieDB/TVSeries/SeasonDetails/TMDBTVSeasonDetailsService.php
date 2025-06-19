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
    public function __construct(
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_TV_SERIES_DETAILS_URL)%')]
        private string $apiUrl,
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger,
        private EntityManagerInterface $entityManager
    ){}

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
        catch (TransportExceptionInterface $e) // API nicht erreichbar
        {
            $this->logger->error('TMDB API not reachable: ' . $e->getMessage());
            return [
                'error' => 'The TMDB API is currently unavailable. Please try again later.',
                'code' => 503,
            ];
        }
        catch (ClientExceptionInterface $e) // Client-Fehler (400er-Statuscodes)
        {
            $this->logger->error('Client error with TMDB API: ' . $e->getMessage());
            return [
                'error' => 'Invalid request to TMDB API.',
                'code' => 400,
            ];
        }
        catch (ServerExceptionInterface $e) // Server-Fehler bei TMDB (500er-Statuscodes)
        {
            $this->logger->error('TMDB API server error: ' . $e->getMessage());
            return [
                'error' => 'TMDB API is currently experiencing issues. Please try again later.',
                'code' => 502,
            ];
        }
        catch (RedirectionExceptionInterface $e) // Unerwartete Weiterleitung
        {
            $this->logger->error('Unexpected TMDB API redirection: ' . $e->getMessage());
            return [
                'error' => 'Unexpected response from TMDB API.',
                'code' => 502,
            ];
        }
    }

    public function handleSeasonDetails(int $seriesID, int $seasonNumber, Media $media, string $language = 'de-DE'): Season
    {
        $response = $this->getTVSeasonDetails($seriesID, $seasonNumber, $language);
        $tmdbSeasonID = $response['id'];
        $name = $response['name'];
        $overview = $response['overview'];
        $seasonNumber = $response['season_number'];
        $airDate = $response['air_date'] !== null
            ? DateTime::createFromFormat('Y-m-d', $response['air_date'])
            : null;
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
            $airDate = $singleEpisode['air_date'] !== null
                ? DateTime::createFromFormat('Y-m-d', $singleEpisode['air_date'])
                : null;


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
                ->setTmdbEpisodeID($tmdbEpisodeID)
            ;

            $this->entityManager->persist($episode);
        }

        $this->entityManager->flush();

        return $season;
    }
}