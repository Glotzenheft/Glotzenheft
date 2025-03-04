<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Season;
use App\Entity\Episode;
use App\Entity\Media;
use DateTime;
use PHPUnit\Framework\TestCase;

class SeasonTest extends TestCase
{
    public function testSetAndGetMedia(): void
    {
        // Arrange
        $season = new Season();
        $media = $this->createMock(Media::class);
        
        // Act
        $season->setMedia($media);
        
        // Assert
        $this->assertSame($media, $season->getMedia());
    }

    public function testSetAndGetTmdbSeasonID(): void
    {
        // Arrange
        $season = new Season();
        $tmdbSeasonID = 12345;
        
        // Act
        $season->setTmdbSeasonID($tmdbSeasonID);
        
        // Assert
        $this->assertSame($tmdbSeasonID, $season->getTmdbSeasonID());
    }

    public function testSetAndGetSeasonNumber(): void
    {
        // Arrange
        $season = new Season();
        $seasonNumber = 2;
        
        // Act
        $season->setSeasonNumber($seasonNumber);
        
        // Assert
        $this->assertSame($seasonNumber, $season->getSeasonNumber());
    }

    public function testSetAndGetName(): void
    {
        // Arrange
        $season = new Season();
        $name = "Season One";
        
        // Act
        $season->setName($name);
        
        // Assert
        $this->assertSame($name, $season->getName());
    }

    public function testSetAndGetOverview(): void
    {
        // Arrange
        $season = new Season();
        $overview = "This is a test overview.";
        
        // Act
        $season->setOverview($overview);
        
        // Assert
        $this->assertSame($overview, $season->getOverview());
    }

    public function testSetAndGetAirDate(): void
    {
        // Arrange
        $season = new Season();
        $date = new DateTime('2023-01-01');
        
        // Act
        $season->setAirDate($date);
        
        // Assert
        $this->assertSame($date, $season->getAirDate());
    }

    public function testSetAndGetEpisodeCount(): void
    {
        // Arrange
        $season = new Season();
        $count = 10;
        
        // Act
        $season->setEpisodeCount($count);
        
        // Assert
        $this->assertSame($count, $season->getEpisodeCount());
    }

    public function testAddAndRemoveEpisode(): void
    {
        // Arrange
        $season = new Season();
        $episode = $this->createMock(Episode::class);
        
        // Act
        $season->addEpisode($episode);
        
        // Assert
        $this->assertTrue($season->getEpisodes()->contains($episode));
        
        // Act
        $season->removeEpisode($episode);
        
        // Assert
        $this->assertFalse($season->getEpisodes()->contains($episode));
    }
}
