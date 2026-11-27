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
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Model\Request\TracklistSeason\PatchTracklistSeasonEpisodesDto;
use App\Model\Request\TracklistSeason\TracklistSeasonEpisodeStateDto;
use App\Repository\EpisodeRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\Tracklist\TracklistSeasonService;
use App\Service\WatchActivity\WatchActivitySynchronizer;
use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use ReflectionProperty;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class TracklistSeasonServiceTest extends TestCase
{
    private TracklistSeasonRepository&MockObject $seasons;
    private EpisodeRepository&MockObject $episodes;
    private EntityManagerInterface&MockObject $manager;
    private Connection&MockObject $connection;
    private TracklistSeasonService $service;
    private User $user;
    private TracklistSeason $season;

    protected function setUp(): void
    {
        $this->seasons = $this->createMock(TracklistSeasonRepository::class);
        $this->episodes = $this->createMock(EpisodeRepository::class);
        $this->manager = $this->createMock(EntityManagerInterface::class);
        $this->connection = $this->createMock(Connection::class);
        $this->manager->method('getConnection')->willReturn($this->connection);
        $this->connection->method('transactional')->willReturnCallback(fn (callable $work) => $work($this->connection));
        $this->service = new TracklistSeasonService(
            $this->seasons, $this->episodes, $this->manager, new WatchActivitySynchronizer($this->manager),
        );
        $this->user = new User();
        $sourceSeason = (new Season())->setSeasonNumber(1);
        $this->initialize($sourceSeason, 1);
        $this->season = (new TracklistSeason())->setSeason($sourceSeason);
        $this->initialize($this->season, 10);
    }

    public function testMixedPatchRemovesUpdatesAndCreatesInOneFlushAndPreservesOmittedSightings(): void
    {
        // Arrange
        $remove = $this->sighting(1);
        $update = $this->sighting(2)->setWatchDate(new DateTimeImmutable('2026-11-10'));
        $keep = $this->sighting(3);
        $source = $this->episode(4);
        $date = new DateTimeImmutable('2026-11-20 18:10:00');
        $dto = new PatchTracklistSeasonEpisodesDto([
            new TracklistSeasonEpisodeStateDto(1, false),
            new TracklistSeasonEpisodeStateDto(2, true, null),
            new TracklistSeasonEpisodeStateDto(4, true, $date),
        ]);
        $this->seasons->method('findForUser')->with(10, $this->user, true)->willReturn($this->season);
        $this->episodes->method('findBy')->with(['season' => $this->season->getSeason(), 'id' => [1, 2, 4]])
            ->willReturn([$remove->getEpisode(), $update->getEpisode(), $source]);
        $this->manager->expects(self::once())->method('remove')->with(self::identicalTo($remove));
        $this->manager->expects(self::once())->method('persist')->willReturnCallback(fn ($te) => $this->initialize($te, 104));
        $this->manager->expects(self::once())->method('flush');
        $this->connection->expects(self::once())->method('fetchAllAssociative')
            ->with(self::anything(), [[102, 104]])->willReturn([]);

        // Act
        $result = $this->service->patchEpisodes(10, $this->user, $dto);

        // Assert
        self::assertTrue(array_is_list($result->tracklistEpisodes));
        self::assertSame([102, $keep->getId(), 104], array_column($result->tracklistEpisodes, 'id'));
        self::assertSame([null, null, '2026-11-20 18:10:00'], array_column($result->tracklistEpisodes, 'watchDateTime'));
    }

    public function testRetryOfDesiredStateDoesNotCreateOrRemoveSightings(): void
    {
        // Arrange
        $watched = $this->sighting(1);
        $absent = $this->episode(2);
        $this->seasons->method('findForUser')->willReturn($this->season);
        $this->episodes->method('findBy')->willReturn([$watched->getEpisode(), $absent]);
        $this->manager->expects(self::never())->method('persist');
        $this->manager->expects(self::never())->method('remove');
        $this->connection->expects(self::never())->method('fetchAllAssociative');
        $dto = new PatchTracklistSeasonEpisodesDto([
            new TracklistSeasonEpisodeStateDto(1, true),
            new TracklistSeasonEpisodeStateDto(2, false),
        ]);

        // Act
        $result = $this->service->patchEpisodes(10, $this->user, $dto);

        // Assert
        self::assertSame([101], array_column($result->tracklistEpisodes, 'id'));
    }

    public function testEpisodeOutsideSeasonRejectsEntirePatch(): void
    {
        // Arrange
        $existing = $this->sighting(1);
        $this->seasons->method('findForUser')->willReturn($this->season);
        $this->episodes->method('findBy')->willReturn([$existing->getEpisode()]);
        $this->manager->expects(self::never())->method('flush');
        $dto = new PatchTracklistSeasonEpisodesDto([
            new TracklistSeasonEpisodeStateDto(1, false),
            new TracklistSeasonEpisodeStateDto(999, true),
        ]);

        // Act
        try {
            $this->service->patchEpisodes(10, $this->user, $dto);
            self::fail('Expected the unknown episode to reject the patch.');
        } catch (NotFoundHttpException $exception) {
            // Assert
            self::assertSame(404, $exception->getStatusCode());
            self::assertSame([$existing], $this->season->getTracklistEpisodes()->toArray());
        }
    }

    public function testDuplicateEpisodeIsRejected(): void
    {
        // Arrange
        $dto = new PatchTracklistSeasonEpisodesDto([
            new TracklistSeasonEpisodeStateDto(1, true),
            new TracklistSeasonEpisodeStateDto(1, false),
        ]);
        $this->manager->expects(self::never())->method('flush');

        // Act
        try {
            $this->service->patchEpisodes(10, $this->user, $dto);
            self::fail('Expected duplicate episode IDs to be rejected.');
        } catch (ConflictHttpException $exception) {
            // Assert
            self::assertSame(409, $exception->getStatusCode());
        }
    }

    public function testSeasonOutsideUserScopeRejectsPatch(): void
    {
        // Arrange
        $this->seasons->expects(self::once())->method('findForUser')->with(10, $this->user, true)->willReturn(null);
        $this->episodes->expects(self::never())->method('findBy');
        $dto = new PatchTracklistSeasonEpisodesDto([new TracklistSeasonEpisodeStateDto(1, true)]);

        // Act
        try {
            $this->service->patchEpisodes(10, $this->user, $dto);
            self::fail('Expected the season to be inaccessible.');
        } catch (NotFoundHttpException $exception) {
            // Assert
            self::assertSame(404, $exception->getStatusCode());
        }
    }

    private function episode(int $id): Episode
    {
        $episode = (new Episode())->setSeason($this->season->getSeason())->setEpisodeNumber($id);
        $this->initialize($episode, $id);
        return $episode;
    }

    private function sighting(int $id): TracklistEpisode
    {
        $sighting = (new TracklistEpisode())->setEpisode($this->episode($id));
        $this->initialize($sighting, 100 + $id);
        $this->season->addTracklistEpisode($sighting);
        return $sighting;
    }

    private function initialize(Season|TracklistSeason|Episode|TracklistEpisode $entity, int $id): void
    {
        (new ReflectionProperty($entity, 'id'))->setValue($entity, $id);
        $entity->setCreatedAtValue();
    }
}
