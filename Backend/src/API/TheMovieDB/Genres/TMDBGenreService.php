<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

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
        public LoggerInterface $logger,
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