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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Service\Statistic;

use App\Entity\Tracklist;
use App\Entity\User;
use App\Service\RequestTrait;
use DateTimeImmutable;
use Exception;
use Symfony\Component\HttpFoundation\Request;

class StatisticService
{
    use RequestTrait;

    public function getWatchTimePerDay(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        try
        {
            $periodStart = isset($this->data['period_start_date'])
                ? new DateTimeImmutable($this->data['period_start_date'])
                : new DateTimeImmutable('0001-01-01');

            $periodEnd = isset($this->data['period_end_date'])
                ? new DateTimeImmutable($this->data['period_end_date'])
                : new DateTimeImmutable();
        }
        catch (Exception)
        {
            return $this->returnInvalidDate();
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $conn = $this->entityManager->getConnection();

        $sql = <<<'SQL'
SELECT   day, SUM(minutes) AS minutes
FROM    (
    SELECT DATE(te.watch_date)        AS day,
           SUM(e.runtime)             AS minutes
    FROM   tracklist_episode   te
    JOIN   tracklist_season    ts ON ts.id = te.tracklist_season_id
    JOIN   tracklist           tl ON tl.id = ts.tracklist_id
    JOIN   episode             e  ON e.id  = te.episode_id
    WHERE  tl.user_id = :userId
      AND  te.watch_date BETWEEN :start AND :end
    GROUP  BY DATE(te.watch_date)

    UNION ALL

    SELECT DATE(tl.finish_date)       AS day,
           SUM(m.runtime)             AS minutes
    FROM   tracklist           tl
    JOIN   media               m  ON m.id = tl.media_id
    WHERE  tl.user_id = :userId
      AND  m.type   = 'Movie'
      AND  tl.finish_date BETWEEN :start AND :end
    GROUP  BY DATE(tl.finish_date)
) AS daily
GROUP BY day
ORDER BY day DESC
SQL;

        try
        {
            $rows = $conn->executeQuery(
                $sql,
                [
                    'userId' => $this->data['user_id'],
                    'start' => $periodStart->format('Y-m-d 00:00:00'),
                    'end' => $periodEnd->format('Y-m-d 23:59:59'),
                ]
            )->fetchAllAssociative();
        }
        catch (Exception)
        {
            return $this->returnDatabaseError();
        }


        $watchTime = [];
        $watchTime['unknown_date'] = 0;
        foreach ($rows as $row)
        {
            $watchTime[$row['day']] = (int)$row['minutes'];
        }

        $unknownSql = <<<'SQL'
SELECT SUM(r.minutes) FROM (
    SELECT SUM(e.runtime) AS minutes
    FROM   tracklist_episode te
    JOIN   tracklist_season ts ON ts.id = te.tracklist_season_id
    JOIN   tracklist        tl ON tl.id = ts.tracklist_id
    JOIN   episode          e  ON e.id  = te.episode_id
    WHERE  tl.user_id = :userId
      AND  te.watch_date IS NULL

    UNION ALL

    SELECT SUM(m.runtime) AS minutes
    FROM   tracklist tl
    JOIN   media     m ON m.id = tl.media_id
    WHERE  tl.user_id     = :userId
      AND  tl.finish_date IS NULL
      AND  m.type = 'Movie'
) AS r
SQL;

        try
        {
            $unknownMinutes = (int)$conn->fetchOne($unknownSql, ['userId' => $this->data['user_id']]);
        }
        catch (Exception)
        {
            return $this->returnDatabaseError();
        }

        if ($unknownMinutes > 0) $watchTime['unknown_date'] = $unknownMinutes;

        return $watchTime;
    }

    public function getUserRatings(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnUserNotFound();
        }

        $qb = $this->entityManager->createQueryBuilder();
        $qb->select(
            "CASE WHEN t.rating IS NULL THEN 'no_rating' 
                  ELSE CONCAT(t.rating, '') END AS rating_key",
            "COUNT(t.id) AS cnt"
        )
            ->from(Tracklist::class, 't')
            ->where('t.user = :user')
            ->groupBy('rating_key')
            ->setParameter('user', $user);

        try
        {
            /** @var array{rating_key:string, cnt:string}[] $rows */
            $rows = $qb
                ->getQuery()
                ->getArrayResult();
        }
        catch (Exception)
        {
            return $this->returnDatabaseError();
        }

        // 4) PHP-Seitige Aufbereitung & Sortierung
        $numeric = [];
        $noRating = 0;
        foreach ($rows as $row)
        {
            if ($row['rating_key'] === 'no_rating')
            {
                $noRating = (int)$row['cnt'];
            }
            else
            {
                $numeric[(int)$row['rating_key']] = (int)$row['cnt'];
            }
        }

        ksort($numeric, SORT_NUMERIC);

        $ratings = ['no_rating' => $noRating];
        foreach ($numeric as $rate => $cnt)
        {
            $ratings[(string)$rate] = $cnt;
        }

        return $ratings;
    }
}