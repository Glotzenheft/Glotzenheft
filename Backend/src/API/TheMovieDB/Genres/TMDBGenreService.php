<?php

namespace App\API\TheMovieDB\Genres;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class TMDBGenreService implements TMDBGenreInterface
{
    private Client $client;

    public function __construct
    (
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_TV_GENRE_URL)%')]
        private string $tvGenreURL,
        #[Autowire('%env(TMDB_MOVIE_GENRE_URL)%')]
        private string $movieGenreURL,
        public readonly LoggerInterface $logger,
    )
    {
        $this->client = new Client();
    }

    /**
     * @throws GuzzleException
     */
    public function getTVGenres(): array
    {
        $response = $this->client->request('GET', $this->tvGenreURL, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->tmdbToken,
                'accept' => 'application/json',
            ]
        ]);

        if ($response->getStatusCode() !== 200)
        {
            $this->logger->error('Could not get tv genres.');
            return [];
        }

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * @throws GuzzleException
     */
    public function getMovieGenres(): array
    {
        $response = $this->client->request('GET', $this->movieGenreURL, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->tmdbToken,
                'accept' => 'application/json',
            ]
        ]);

        if ($response->getStatusCode() !== 200)
        {
            $this->logger->error('Could not get movie genres.');
            return [];
        }

        return json_decode($response->getBody()->getContents(), true);
    }
}