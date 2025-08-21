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
    public function __construct(
        #[Autowire('%env(TMDB_TOKEN)%')]
        private string $tmdbToken,
        #[Autowire('%env(TMDB_MOVIE_DETAILS_URL)%')]
        private string $apiUrl,
        private HttpClientInterface $httpClient,
        private LoggerInterface $logger
    ){}

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
}