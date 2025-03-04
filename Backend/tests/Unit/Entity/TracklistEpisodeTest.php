<?php declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Episode;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use PHPUnit\Framework\TestCase;

class TracklistEpisodeTest extends TestCase
{
    public function testSetAndGetEpisode(): void
    {
        // Arrange
        $tracklistEpisode = new TracklistEpisode();
        $episode = $this->createMock(Episode::class);
        
        // Act
        $tracklistEpisode->setEpisode($episode);
        
        // Assert
        $this->assertSame($episode, $tracklistEpisode->getEpisode());
    }

    public function testSetAndGetWatchDate(): void
    {
        // Arrange
        $tracklistEpisode = new TracklistEpisode();
        $watchDate = new \DateTime('2023-01-01');
        
        // Act
        $tracklistEpisode->setWatchDate($watchDate);
        
        // Assert
        $this->assertSame($watchDate, $tracklistEpisode->getWatchDate());
    }

    public function testSetAndGetTracklistSeason(): void
    {
        // Arrange
        $tracklistEpisode = new TracklistEpisode();
        $tracklistSeason = $this->createMock(TracklistSeason::class);
        
        // Act
        $tracklistEpisode->setTracklistSeason($tracklistSeason);
        
        // Assert
        $this->assertSame($tracklistSeason, $tracklistEpisode->getTracklistSeason());
    }
}
