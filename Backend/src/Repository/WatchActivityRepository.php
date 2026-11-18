<?php
declare(strict_types=1);

namespace App\Repository;

use App\Entity\User;
use App\Entity\WatchActivity;
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

    public function countDatedByUser(User $user): int
    {
        return (int) $this->datedActivities($user)
            ->select('COUNT(activity.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }

    /** @return list<WatchActivityResponseDto> */
    public function findDatedByUser(User $user, int $offset, int $limit): array
    {
        $dto = WatchActivityResponseDto::class;

        return $this->datedActivities($user)
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
            ->join('activity.media', 'media')
            ->join('activity.tracklist', 'tracklist')
            ->leftJoin('activity.episode', 'episode')
            ->leftJoin('episode.season', 'season')
            ->leftJoin('activity.tracklistEpisode', 'tracklistEpisode')
            ->leftJoin('tracklistEpisode.tracklistSeason', 'tracklistSeason')
            ->orderBy('activity.watchedAt', 'DESC')
            ->addOrderBy('activity.id', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    private function datedActivities(User $user): QueryBuilder
    {
        return $this->createQueryBuilder('activity')
            ->where('activity.user = :user')
            ->andWhere('activity.watchedAt IS NOT NULL')
            ->setParameter('user', $user);
    }
}
