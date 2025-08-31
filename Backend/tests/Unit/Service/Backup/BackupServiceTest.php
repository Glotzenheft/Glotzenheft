<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Backup;

use App\Entity\Episode;
use App\Entity\Media;
use App\Entity\Season;
use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Enum\MediaType;
use App\Enum\TracklistStatus;
use App\Repository\TracklistRepository;
use App\Service\Backup\BackupService;
use App\Service\Backup\HashService;
use PHPUnit\Framework\TestCase;

class BackupServiceTest extends TestCase
{
    private TracklistRepository $tracklistRepository;
    private HashService $hashService;
    private BackupService $backupService;

    protected function setUp(): void
    {
        $this->tracklistRepository = $this->createMock(TracklistRepository::class);
        $this->hashService = $this->createMock(HashService::class);
        $this->backupService = new BackupService($this->tracklistRepository, $this->hashService);
    }

    public function testGenerateBackupData(): void
    {
        // Arrange
        $user = new User();

        // Mock Movie
        $movieMedia = (new Media())->setTmdbID(123)->setType(MediaType::MOVIE);
        $movieTracklist = (new Tracklist())->setMedia($movieMedia)->setStatus(TracklistStatus::COMPLETED)->setRating(8);

        // Mock TV Show
        $showMedia = (new Media())->setTmdbID(456)->setType(MediaType::SHOW);
        $showTracklist = (new Tracklist())->setMedia($showMedia)->setStatus(TracklistStatus::WATCHING);

        $season = (new Season())->setSeasonNumber(1);
        $episode = (new Episode())->setEpisodeNumber(1);

        $tracklistSeason = (new TracklistSeason())->setSeason($season);
        $tracklistEpisode = (new TracklistEpisode())->setEpisode($episode);

        $tracklistSeason->addTracklistEpisode($tracklistEpisode);
        $showTracklist->addTracklistSeason($tracklistSeason);

        $this->tracklistRepository->method('findBy')->with(['user' => $user])->willReturn([$movieTracklist, $showTracklist]);

        // Mock hash generation
        $this->hashService->method('generateForData')->will($this->onConsecutiveCalls(
            'episode_hash', // first episode
            'season_hash',  // then season
            'show_hash',    // then tracklist for the show
            'movie_hash'    // then tracklist for the movie
        ));

        // Act
        $result = $this->backupService->generateBackupData($user);

        // Assert
        $this->assertCount(2, $result['tracklists']);
        $this->assertEquals(2, $result['count']);

        // Assert Movie Data
        $movieBackup = $result['tracklists'][0]; // Assuming order is preserved
        $this->assertEquals('movie_hash', $movieBackup['hash']);
        $this->assertArrayNotHasKey('seasons', $movieBackup);

        // Assert Show Data
        $showBackup = $result['tracklists'][1];
        $this->assertEquals('show_hash', $showBackup['hash']);
        $this->assertArrayHasKey('seasons', $showBackup);
        $this->assertCount(1, $showBackup['seasons']);

        $seasonBackup = $showBackup['seasons'][0];
        $this->assertEquals('season_hash', $seasonBackup['hash']);
        $this->assertCount(1, $seasonBackup['episodes']);

        $episodeBackup = $seasonBackup['episodes'][0];
        $this->assertEquals('episode_hash', $episodeBackup['hash']);
    }
}
