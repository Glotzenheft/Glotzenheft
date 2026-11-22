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

namespace App\Tests\Unit\Service\Tracklist;

use App\Entity\Episode;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Model\Request\TracklistEpisode\CreateBulkTracklistEpisodeRequestDto;
use App\Model\Request\TracklistEpisode\CreateTracklistEpisodeRequestDto;
use App\Repository\EpisodeRepository;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\Tracklist\TracklistEpisodeService;
use App\Service\WatchActivity\WatchActivitySynchronizer;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\PDO\Exception as DriverException;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use PDOException;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use ReflectionProperty;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class TracklistEpisodeServiceTest extends TestCase
{
    private TracklistEpisodeService $service;
    private EpisodeRepository&MockObject $sources;
    private TracklistSeasonRepository&MockObject $seasons;
    private EntityManagerInterface&MockObject $manager;
    private User $user;
    private TracklistSeason $tracklistSeason;
    private Connection&MockObject $connection;

    protected function setUp(): void
    {
        $this->manager = $this->createMock(EntityManagerInterface::class);
        $this->connection = $this->createMock(Connection::class);
        $this->manager->method('getConnection')->willReturn($this->connection);
        $this->sources = $this->createMock(EpisodeRepository::class);
        $this->seasons = $this->createMock(TracklistSeasonRepository::class);
        $this->service = new TracklistEpisodeService(
            $this->seasons,
            $this->createMock(TracklistEpisodeRepository::class),
            $this->sources,
            $this->manager,
            new WatchActivitySynchronizer($this->manager),
        );
        $this->user = new User();
        $tracklist = (new Tracklist())->setUser($this->user);
        (new ReflectionProperty(Tracklist::class, 'id'))->setValue($tracklist, 1);
        $this->tracklistSeason = (new TracklistSeason())->setTracklist($tracklist)->setSeason(new Season());
    }

    public function testCreatesAndSynchronizesEpisodesInRequestOrderAcrossTracklistSeasons(): void
    {
        // Arrange
        $otherTracklist = (new Tracklist())->setUser($this->user);
        (new ReflectionProperty(Tracklist::class, 'id'))->setValue($otherTracklist, 2);
        $otherSeason = (new TracklistSeason())->setSeason($this->tracklistSeason->getSeason())
            ->setTracklist($otherTracklist);
        $this->seasons->method('find')->willReturnCallback(
            fn (int $id) => $id === 10 ? $this->tracklistSeason : $otherSeason,
        );
        $first = $this->sourceEpisode(21);
        $second = $this->sourceEpisode(22);
        $this->sources->expects(self::exactly(2))->method('findBy')->willReturnOnConsecutiveCalls([$second, $first], [$first]);
        $date = new DateTimeImmutable('2026-03-14 19:30:00');
        $batch = new CreateBulkTracklistEpisodeRequestDto([
            new CreateTracklistEpisodeRequestDto(1, 10, 21, $date),
            new CreateTracklistEpisodeRequestDto(2, 11, 21),
            new CreateTracklistEpisodeRequestDto(1, 10, 22),
        ]);
        $persisted = [];
        $this->manager->method('persist')->willReturnCallback(static function (TracklistEpisode $episode) use (&$persisted): void {
            $persisted[] = $episode;
        });
        $this->manager->expects(self::once())->method('flush')->willReturnCallback(static function () use (&$persisted): void {
            foreach ($persisted as $index => $episode) {
                (new ReflectionProperty(TracklistEpisode::class, 'id'))->setValue($episode, $index + 100);
                $episode->setCreatedAtValue();
            }
        });
        $this->connection->expects(self::once())->method('transactional')->willReturnCallback(fn (callable $work) => $work($this->connection));
        $this->connection->expects(self::once())->method('fetchAllAssociative')->with(self::anything(), [[100, 101, 102]])->willReturn([]);

        // Act
        $result = $this->service->createBulkTracklistEpisodes($batch, $this->user);

        // Assert
        self::assertSame([100, 101, 102], array_column($result, 'id'));
        self::assertSame([21, 21, 22], array_column(array_column($result, 'episodeDto'), 'id'));
        self::assertSame(['2026-03-14 19:30:00', null, null], array_column($result, 'watchDateTime'));
        self::assertSame([$this->tracklistSeason, $otherSeason, $this->tracklistSeason], array_map(
            static fn (TracklistEpisode $episode) => $episode->getTracklistSeason(), $persisted,
        ));
    }

    public function testRejectsRepeatedEpisodeInSameTracklistSeason(): void
    {
        // Arrange
        $episode = new CreateTracklistEpisodeRequestDto(1, 10, 21);
        $batch = new CreateBulkTracklistEpisodeRequestDto([$episode, $episode]);
        $this->manager->expects(self::never())->method('persist');
        $this->manager->expects(self::never())->method('flush');

        // Act
        try {
            $this->service->createBulkTracklistEpisodes($batch, $this->user);
            self::fail('Expected a duplicate conflict.');
        } catch (ConflictHttpException $exception) {
            // Assert
            self::assertSame(409, $exception->getStatusCode());
        }
    }

    public function testReportsConflictWhenDatabaseRejectsExistingEpisode(): void
    {
        // Arrange
        $this->seasons->method('find')->willReturn($this->tracklistSeason);
        $this->sources->method('findBy')->willReturn([$this->sourceEpisode(21)]);
        $conflict = new UniqueConstraintViolationException(
            DriverException::new(new PDOException("Duplicate entry for key 'uniq_tracklist_season_episode'")),
            null,
        );
        $this->connection->method('transactional')->willThrowException($conflict);
        $batch = new CreateBulkTracklistEpisodeRequestDto([new CreateTracklistEpisodeRequestDto(1, 10, 21)]);

        // Act
        try {
            $this->service->createBulkTracklistEpisodes($batch, $this->user);
            self::fail('Expected the existing episode to cause a conflict.');
        } catch (ConflictHttpException $exception) {
            // Assert
            self::assertSame($conflict, $exception->getPrevious());
        }
    }

    public function testRejectsAnotherUsersTracklistSeasonBeforeWriting(): void
    {
        // Arrange
        $this->seasons->method('find')->willReturn($this->tracklistSeason);
        $this->manager->expects(self::never())->method('persist');
        $this->manager->expects(self::never())->method('flush');
        $batch = new CreateBulkTracklistEpisodeRequestDto([new CreateTracklistEpisodeRequestDto(1, 10, 21)]);

        // Act
        try {
            $this->service->createBulkTracklistEpisodes($batch, new User());
            self::fail('Expected access to the other user’s tracklist season to be denied.');
        } catch (NotFoundHttpException $exception) {
            // Assert
            self::assertSame(404, $exception->getStatusCode());
        }
    }

    public function testRejectsBatchWhenOneSourceIsMissingFromTheSeason(): void
    {
        // Arrange
        $this->seasons->method('find')->willReturn($this->tracklistSeason);
        $this->sources->method('findBy')->with(['season' => $this->tracklistSeason->getSeason(), 'id' => [21, 22]])
            ->willReturn([$this->sourceEpisode(21)]);
        $this->manager->expects(self::never())->method('persist');
        $this->manager->expects(self::never())->method('flush');
        $batch = new CreateBulkTracklistEpisodeRequestDto([
            new CreateTracklistEpisodeRequestDto(1, 10, 21),
            new CreateTracklistEpisodeRequestDto(1, 10, 22),
        ]);

        // Act
        try {
            $this->service->createBulkTracklistEpisodes($batch, $this->user);
            self::fail('Expected an unknown source episode to reject the batch.');
        } catch (NotFoundHttpException $exception) {
            // Assert
            self::assertSame(404, $exception->getStatusCode());
        }
    }

    private function sourceEpisode(int $id): Episode
    {
        $episode = (new Episode())->setEpisodeNumber($id)->setCreatedAt(new DateTimeImmutable());
        (new ReflectionProperty(Episode::class, 'id'))->setValue($episode, $id);
        return $episode;
    }
}
