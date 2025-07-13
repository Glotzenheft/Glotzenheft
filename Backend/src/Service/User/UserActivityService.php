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

declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use App\Service\RequestTrait;
use Doctrine\DBAL\Exception;
use PDO;
use Symfony\Component\HttpFoundation\Request;

class UserActivityService
{
    use RequestTrait;

    /**
     * This function fetches and returns a paginated list of user activities from the database.
     * Activities include:
     *  - Watched TV show episodes.
     *  - Completed movies.
     *
     * @param Request $request
     * @return array
     */
    public function getUserActivities(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $page = $this->data['user_activity_page'] ?? 1;
        $limit = 50;
        $offset = ($page - 1) * $limit;

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $userId = $user->getId();
        $conn   = $this->entityManager->getConnection();

        $countSql =<<<SQL
SELECT
    (
       SELECT COUNT(*)
       FROM tracklist_episode te
       JOIN tracklist_season ts ON ts.id = te.tracklist_season_id
       JOIN tracklist        t  ON t.id  = ts.tracklist_id
       WHERE t.user_id = :userId
         AND te.watch_date IS NOT NULL
    ) +
    (
       SELECT COUNT(*)
       FROM tracklist t
       JOIN media     m ON m.id = t.media_id
       WHERE t.user_id = :userId
         AND t.finish_date IS NOT NULL
         AND m.type = 'movie'
    ) AS total_results
SQL;

        try
        {
            $total = (int) $conn->fetchOne($countSql, ['userId' => $userId]);
            if ($total === 0)
            {
                return $this->createPaginatedResponse(
                    page:   $page,
                    limit:  $limit,
                    total:  $total,
                    rows:   []
                );
            }
        }
        catch(Exception)
        {
            return $this->returnDatabaseError();
        }

        $sql =<<<SQL
(SELECT 
    'episode' AS type, 
    te.watch_date AS date,
    e.runtime AS runtime,
    m.id AS mediaID,
    m.name AS mediaTitle,
    s.id AS seasonID,
    s.season_number AS seasonNumber, 
    e.id AS episodeID,
    e.episode_number AS episodeNumber,
    t.id AS tracklistID,
    t.tracklist_name AS tracklistName,
    ts.id AS tracklistSeasinID,
    te.id AS tracklistEpisodeID,
    s.poster_path AS posterPath,
    e.still_path AS stillPath
FROM tracklist_episode te
JOIN episode e ON te.episode_id = e.id
JOIN season s ON e.season_id = s.id
JOIN media m ON s.media_id = m.id
JOIN tracklist_season ts ON te.tracklist_season_id = ts.id
JOIN tracklist t ON ts.tracklist_id = t.id
WHERE t.user_id = :userId
AND te.watch_date IS NOT NULL)

UNION ALL

(SELECT 
    'movie' AS type, 
    t.finish_date AS date,
    m.runtime AS runtime,
    m.id AS mediaID,
    m.name AS mediaTitle, 
    NULL AS seasonID,
    NULL AS seasonNumber, 
    NULL AS episodeID,
    NULL AS episodeNumber,
    t.id AS tracklistID,
    t.tracklist_name AS tracklistName,
    NULL AS tracklistSeasinID,
    NULL AS tracklistEpisodeID,
    m.poster_path AS posterPath,
    m.backdrop_path AS stillPath
FROM tracklist t
JOIN media m ON t.media_id = m.id
WHERE t.user_id = :userId 
AND t.finish_date IS NOT NULL
AND m.type = 'movie')

ORDER BY date DESC
LIMIT :limit OFFSET :offset
SQL;

        try
        {
            $stmt = $conn->prepare($sql);
            $stmt->bindValue('userId', $userId, PDO::PARAM_INT);
            $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
            $rows = $stmt->executeQuery()->fetchAllAssociative();

            return $this->createPaginatedResponse(
                page:   $page,
                limit:  $limit,
                total:  $total,
                rows:   $rows
            );
        }
        catch (Exception)
        {
            return $this->returnDatabaseError();
        }
    }

    /**
     * @param int $page
     * @param int $limit
     * @param int $total
     * @param array $rows
     * @return array{page:int,total_pages:int,total_results:int,results:array}
     */
    private function createPaginatedResponse(int $page, int $limit, int $total, array $rows): array
    {
        $totalPages = $total > 0
            ? (int) ceil($total / $limit)
            : 0;

        return [
            'page'          => $page,
            'total_pages'   => $totalPages,
            'total_results' => $total,
            'results'       => $rows,
        ];
    }
}