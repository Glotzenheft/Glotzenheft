<?php

namespace App\Tests\Entity;

use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\Season;
use PHPUnit\Framework\TestCase;
use Doctrine\Common\Collections\ArrayCollection;

class TracklistSeasonTest extends TestCase
{
    public function testGetAndSetTracklist(): void
    {
        // Arrange
        $tracklistSeason = new TracklistSeason();
        $tracklist = new Tracklist();

        // Act
        $tracklistSeason->setTracklist($tracklist);

        // Assert
        $this->assertSame($tracklist, $tracklistSeason->getTracklist());
    }

    public function testGetAndSetSeason(): void
    {
        // Arrange
        $tracklistSeason = new TracklistSeason();
        $season = new Season();

        // Act
        $tracklistSeason->setSeason($season);

        // Assert
        $this->assertSame($season, $tracklistSeason->getSeason());
    }

    public function testAddAndRemoveTracklistEpisode(): void
    {
        // Arrange
        $tracklistSeason = new TracklistSeason();
        $episode = new TracklistEpisode();

        // Act
        $tracklistSeason->addTracklistEpisode($episode);

        // Assert
        $this->assertCount(1, $tracklistSeason->getTracklistEpisodes());
        $this->assertSame($tracklistSeason, $episode->getTracklistSeason());

        // Act (removing episode)
        $tracklistSeason->removeTracklistEpisode($episode);

        // Assert
        $this->assertCount(0, $tracklistSeason->getTracklistEpisodes());
        $this->assertNull($episode->getTracklistSeason());
    }

    public function testTracklistEpisodesCollectionIsInitiallyEmpty(): void
    {
        // Arrange
        $tracklistSeason = new TracklistSeason();

        // Assert
        $this->assertInstanceOf(ArrayCollection::class, $tracklistSeason->getTracklistEpisodes());
        $this->assertCount(0, $tracklistSeason->getTracklistEpisodes());
    }
}