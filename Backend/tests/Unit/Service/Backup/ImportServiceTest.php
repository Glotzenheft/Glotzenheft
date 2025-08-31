<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Backup;

use App\Entity\Media;
use App\Entity\Tracklist;
use App\Entity\User;
use App\Repository\TracklistEpisodeRepository;
use App\Repository\TracklistRepository;
use App\Repository\TracklistSeasonRepository;
use App\Service\Backup\ImportService;
use App\Service\Media\MediaService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;
use Symfony\Component\RateLimiter\LimiterInterface;

class ImportServiceTest extends TestCase
{
    private EntityManagerInterface $em;
    private TracklistRepository $tracklistRepository;
    private TracklistSeasonRepository $tracklistSeasonRepository;
    private TracklistEpisodeRepository $tracklistEpisodeRepository;
    private MediaService $mediaService;
    private LimiterInterface $limiter;
    private LoggerInterface $logger;
    private ImportService $importService;

    protected function setUp(): void
    {
        $this->em = $this->createMock(EntityManagerInterface::class);
        $this->tracklistRepository = $this->createMock(TracklistRepository::class);
        $this->tracklistSeasonRepository = $this->createMock(TracklistSeasonRepository::class);
        $this->tracklistEpisodeRepository = $this->createMock(TracklistEpisodeRepository::class);
        $this->mediaService = $this->createMock(MediaService::class);
        $this->limiter = $this->createMock(LimiterInterface::class);
        $this->logger = $this->createMock(LoggerInterface::class);

        $this->importService = new ImportService(
            $this->em,
            $this->tracklistRepository,
            $this->tracklistSeasonRepository,
            $this->tracklistEpisodeRepository,
            $this->mediaService,
            $this->limiter,
            $this->logger
        );
    }

    public function testProcessImportFindsExistingTracklistByHashAndUpdates(): void
    {
        // Arrange
        $user = new User();
        $backupData = [
            'tracklists' => [
                ['hash' => 'existing_hash', 'tmdbId' => 123, 'mediaType' => 'movie', 'rating' => 9]
            ]
        ];
        $existingTracklist = new Tracklist(); // Mock existing tracklist

        $this->mediaService->method('findOrCreateMedia')->willReturn(new Media());
        $this->tracklistRepository->method('findOneBy')->with(['backupHash' => 'existing_hash', 'user' => $user])->willReturn($existingTracklist);

        // Act
        $stats = $this->importService->processImport($backupData, $user);

        // Assert
        $this->assertEquals(0, $stats['imported']);
        $this->assertEquals(1, $stats['updated']);
        $this->assertEquals(0, $stats['failed']);
        $this->assertEquals(9, $existingTracklist->getRating()); // Check that data was updated
    }

    public function testProcessImportCreatesNewTracklist(): void
    {
        // Arrange
        $user = new User();
        $backupData = [
            'tracklists' => [
                ['hash' => 'new_hash', 'tmdbId' => 123, 'mediaType' => 'movie', 'rating' => 9]
            ]
        ];

        $this->mediaService->method('findOrCreateMedia')->willReturn(new Media());
        // Return null to simulate that no tracklist with this hash or media/user combo exists
        $this->tracklistRepository->method('findOneBy')->willReturn(null);

        $this->em->expects($this->once())->method('persist')->with($this->isInstanceOf(Tracklist::class));

        // Act
        $stats = $this->importService->processImport($backupData, $user);

        // Assert
        $this->assertEquals(1, $stats['imported']);
        $this->assertEquals(0, $stats['updated']);
        $this->assertEquals(0, $stats['failed']);
    }
}
