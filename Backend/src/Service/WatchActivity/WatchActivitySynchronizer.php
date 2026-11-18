<?php
declare(strict_types=1);

namespace App\Service\WatchActivity;

use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Enum\MediaType;
use App\Enum\TracklistStatus;
use DateMalformedStringException;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\DBAL\ArrayParameterType;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;

final readonly class WatchActivitySynchronizer
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    /**
     * @param list<TracklistEpisode> $episodes
     * @throws Throwable
     */
    public function flush(?Tracklist $tracklist = null, array $episodes = []): void
    {
        $isMovie = $tracklist?->getMedia()?->getType() === MediaType::Movie;
        if (!$isMovie && $episodes === []) {
            $this->entityManager->flush();
            return;
        }

        try {
            $this->entityManager->getConnection()->transactional(function (Connection $connection) use ($isMovie, $tracklist, $episodes): void {
                $this->entityManager->flush();

                if ($isMovie) {
                    $this->syncMovies($connection, [$tracklist->getId()]);
                }
                if ($episodes !== []) {
                    $this->syncEpisodes($connection, array_map(
                        static fn (TracklistEpisode $episode): int => $episode->getId(),
                        $episodes,
                    ));
                }
            });
        } catch (Throwable $exception) {
            // A rollback may have undone source rows that Doctrine already considers saved.
            $this->entityManager->close();
            throw $exception;
        }
    }

    /** @return array{movies: int, episodes: int}
     * @throws Throwable
     */
    public function backfill(): array
    {
        $connection = $this->entityManager->getConnection();
        $movies = $this->backfillBatches(
            $connection,
            'SELECT t.id FROM tracklist t JOIN media m ON m.id = t.media_id WHERE m.type = :movie AND t.id > :after ORDER BY t.id LIMIT 200',
            ['movie' => MediaType::Movie->value],
            $this->syncMovies(...),
        );
        $episodes = $this->backfillBatches(
            $connection,
            'SELECT id FROM tracklist_episode WHERE id > :after ORDER BY id LIMIT 200',
            [],
            $this->syncEpisodes(...),
        );

        return ['movies' => $movies, 'episodes' => $episodes];
    }

    /**
     * @param array<string, string> $parameters
     * @param callable(Connection, list<int>): void $synchronize
     * @throws Throwable
     */
    private function backfillBatches(Connection $connection, string $sql, array $parameters, callable $synchronize): int
    {
        $after = 0;
        $processed = 0;
        while (true) {
            $ids = array_map('intval', $connection->fetchFirstColumn($sql, $parameters + ['after' => $after]));
            if ($ids === []) {
                return $processed;
            }

            $connection->transactional(static fn (Connection $connection) => $synchronize($connection, $ids));
            $after = $ids[array_key_last($ids)];
            $processed += count($ids);
        }
    }

    /** @param list<int> $ids
     * @throws Exception|DateMalformedStringException
     */
    private function syncMovies(Connection $connection, array $ids): void
    {
        // Read the current source under a lock so a backfill cannot overwrite a concurrent edit.
        $rows = $connection->fetchAllAssociative(
            'SELECT id AS tracklist_id, user_id, media_id, finish_date AS watched_at, status
             FROM tracklist WHERE id IN (?) ORDER BY id FOR UPDATE',
            [$ids],
            [ArrayParameterType::INTEGER],
        );
        foreach ($rows as $row) {
            $status = $row['status'];
            unset($row['status']);
            if ($row['watched_at'] === null && $status !== TracklistStatus::COMPLETED->value) {
                $connection->executeStatement(
                    'DELETE FROM watch_activity WHERE film_tracklist_id = ?',
                    [$row['tracklist_id']],
                );
                continue;
            }

            $this->upsert($connection, $row + ['episode_id' => null, 'tracklist_episode_id' => null]);
        }
    }

    /** @param list<int> $ids
     * @throws Exception|DateMalformedStringException
     */
    private function syncEpisodes(Connection $connection, array $ids): void
    {
        $rows = $connection->fetchAllAssociative(
            'SELECT te.id AS tracklist_episode_id, te.episode_id, t.id AS tracklist_id, t.user_id, t.media_id,
                    te.watch_date AS watched_at
             FROM tracklist_episode te
             JOIN tracklist_season ts ON ts.id = te.tracklist_season_id
             JOIN tracklist t ON t.id = ts.tracklist_id
             WHERE te.id IN (?) ORDER BY te.id FOR UPDATE',
            [$ids],
            [ArrayParameterType::INTEGER],
        );
        foreach ($rows as $row) {
            $this->upsert($connection, $row);
        }
    }

    /** @param array<string, mixed> $activity
     * @throws DateMalformedStringException
     * @throws Exception
     */
    private function upsert(Connection $connection, array $activity): void
    {
        $now = new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin'));
        $connection->executeStatement(
            'INSERT INTO watch_activity
                (user_id, media_id, episode_id, tracklist_id, tracklist_episode_id, watched_at, created_at, updated_at)
             VALUES
                (:user_id, :media_id, :episode_id, :tracklist_id, :tracklist_episode_id, :watched_at, :created_at, :updated_at)
             ON DUPLICATE KEY UPDATE
                updated_at = IF(watched_at <=> VALUES(watched_at), updated_at, VALUES(updated_at)),
                watched_at = VALUES(watched_at)',
            $activity + ['created_at' => $now->format('Y-m-d H:i:s'), 'updated_at' => $now->format('Y-m-d H:i:s')],
        );
    }
}
