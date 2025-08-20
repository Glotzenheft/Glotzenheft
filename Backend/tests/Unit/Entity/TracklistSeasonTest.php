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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

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