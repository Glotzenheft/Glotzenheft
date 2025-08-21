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
