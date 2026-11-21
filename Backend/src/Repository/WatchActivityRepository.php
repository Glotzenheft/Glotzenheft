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

namespace App\Repository;

use App\Entity\TracklistTag;
use App\Entity\User;
use App\Entity\WatchActivity;
use App\Enum\ActivitySortOrder;
use App\Enum\MediaType;
use App\Model\Response\User\ActivityDayResponseDto;
use App\Model\Response\User\WatchActivityResponseDto;
use DateTimeImmutable;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<WatchActivity>
 */
class WatchActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, WatchActivity::class);
    }

    /** @return list<array{day: string|null, minutes: int|string|null}> */
    public function sumWatchTimeByDay(User $user, DateTimeImmutable $start, DateTimeImmutable $end): array
    {
        return $this->createQueryBuilder('activity')
            ->select('WATCH_DATE(activity.watchedAt) AS day')
            ->addSelect('SUM(CASE WHEN episode.id IS NULL THEN media.runtime ELSE episode.runtime END) AS minutes')
            ->join('activity.media', 'media')
            ->leftJoin('activity.episode', 'episode')
            ->where('activity.user = :user')
            ->andWhere('(activity.watchedAt BETWEEN :start AND :end OR activity.watchedAt IS NULL)')
            ->groupBy('day')
            ->orderBy('day', 'DESC')
            ->setParameter('user', $user)
            ->setParameter('start', $start, Types::DATETIME_IMMUTABLE)
            ->setParameter('end', $end, Types::DATETIME_IMMUTABLE)
            ->getQuery()
            ->getScalarResult();
    }

    public function countDatedByUser(User $user, ?MediaType $type, ?int $mediaId, string $search = '', ?TracklistTag $tag = null): int
    {
        return (int) $this->datedActivities($user, $type, $mediaId, $search, $tag)
            ->select('COUNT(activity.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /** @return list<WatchActivityResponseDto> */
    public function findDatedByUser(
        User $user,
        int $offset,
        int $limit,
        ?MediaType $type,
        ?int $mediaId,
        string $search = '',
        ActivitySortOrder $sortOrder = ActivitySortOrder::Newest,
        ?TracklistTag $tag = null,
    ): array
    {
        $dto = WatchActivityResponseDto::class;

        return $this->datedActivities($user, $type, $mediaId, $search, $tag)
            ->select(<<<DQL
                NEW $dto(
                    activity.watchedAt,
                    CASE WHEN episode.id IS NULL THEN media.runtime ELSE episode.runtime END,
                    media.id,
                    media.name,
                    season.id,
                    season.seasonNumber,
                    episode.id,
                    episode.episodeNumber,
                    tracklist.id,
                    tracklist.tracklistName,
                    tracklistSeason.id,
                    tracklistEpisode.id,
                    CASE WHEN episode.id IS NULL THEN media.posterPath ELSE season.posterPath END,
                    CASE WHEN episode.id IS NULL THEN media.backdropPath ELSE episode.stillPath END
                )
                DQL)
            ->leftJoin('activity.episode', 'episode')
            ->leftJoin('episode.season', 'season')
            ->leftJoin('activity.tracklistEpisode', 'tracklistEpisode')
            ->leftJoin('tracklistEpisode.tracklistSeason', 'tracklistSeason')
            ->orderBy('activity.watchedAt', $sortOrder->value)
            ->addOrderBy('activity.id', $sortOrder->value)
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /** @return list<ActivityDayResponseDto> */
    public function summarizeDays(
        User $user,
        ?MediaType $type,
        ?int $mediaId,
        DateTimeImmutable $start,
        DateTimeImmutable $endExclusive,
        string $search = '',
        ?TracklistTag $tag = null,
    ): array {
        $dto = ActivityDayResponseDto::class;

        return $this->datedActivities($user, $type, $mediaId, $search, $tag)
            ->select("NEW $dto(WATCH_DATE(activity.watchedAt), COUNT(activity.id), SUM(CASE WHEN episode.id IS NULL THEN media.runtime ELSE episode.runtime END))")
            ->leftJoin('activity.episode', 'episode')
            ->andWhere('activity.watchedAt >= :start AND activity.watchedAt < :end')
            ->setParameter('start', $start, Types::DATETIME_IMMUTABLE)
            ->setParameter('end', $endExclusive, Types::DATETIME_IMMUTABLE)
            ->addSelect('WATCH_DATE(activity.watchedAt) AS HIDDEN day')
            ->groupBy('day')
            ->getQuery()
            ->getResult();
    }

    private function datedActivities(User $user, ?MediaType $type, ?int $mediaId, string $search, ?TracklistTag $tag): QueryBuilder
    {
        $query = $this->createQueryBuilder('activity')
            ->join('activity.media', 'media')
            ->join('activity.tracklist', 'tracklist')
            ->where('activity.user = :user')
            ->andWhere('activity.watchedAt IS NOT NULL')
            ->setParameter('user', $user);

        if ($search !== '') {
            $query->andWhere('(LOCATE(LOWER(:search), LOWER(media.name)) > 0 OR LOCATE(LOWER(:search), LOWER(tracklist.tracklistName)) > 0)')
                ->setParameter('search', $search);
        }
        if ($type !== null) {
            $query->andWhere('media.type = :type')->setParameter('type', $type->value);
        }
        if ($mediaId !== null) {
            $query->andWhere('media.id = :mediaId')->setParameter('mediaId', $mediaId);
        }

        if ($tag !== null) {
            $query->andWhere(':tag MEMBER OF tracklist.tracklistTags')->setParameter('tag', $tag);
        }

        return $query;
    }
}
