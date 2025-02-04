<?php declare(strict_types=1);

namespace App\API\TheMovieDB\Movies\Details;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class TMDBMovieDetailsService implements TMDBMovieDetailsInterface
{
    public function __construct
    (
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_MOVIE_DETAILS_URL)%')]
        private string $apiUrl,
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    )
    {
    }

    public function getMovieDetails(int $movieID, string $language = 'de-DE'): array
    {
        try
        {
            $response = $this->httpClient->request('GET', $this->apiUrl . $movieID . '?append_to_response=external_ids&language=' . $language, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->tmdbToken,
                    'accept' => 'application/json',
                ]
            ]);

            return json_decode($response->getContent(), true);
        }
        catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e)
        {
            $this->logger->error('Exception occured while TMDBMovieDetailsService: ' . $e->getMessage());
            return [];
        }
    }
}