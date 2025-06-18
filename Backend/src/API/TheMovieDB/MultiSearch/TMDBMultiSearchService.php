<?php

namespace App\API\TheMovieDB\MultiSearch;

use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class TMDBMultiSearchService implements TMDBMultiSearchInterface
{
    public function __construct(
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_MULTI_SEARCH_URL)%')]
        private string $multiSearchUrl,
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ){}

    public function multiSearch(string $q, int $page = 1, $language = 'de-DE'): array
    {
        try
        {
            $response = $this->httpClient->request('GET', $this->multiSearchUrl, [
                'query' => [
                    'query' => $q,
                    'page' => $page,
                    'language' => $language,
                    'include_adult' => 'true'
                ],
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->tmdbToken,
                ],
            ]);

            $decodedResponse = json_decode($response->getContent(), true);

            if (!isset($decodedResponse['results']))
            {
                throw new RuntimeException('Unerwartetes API-Antwortformat.');
            }

            return $decodedResponse;
        }
        catch (TransportExceptionInterface|ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface $e)
        {
            $this->logger->error('Exception occured while multi-search service: ' . $e->getMessage());
            return [];
        }
    }
}