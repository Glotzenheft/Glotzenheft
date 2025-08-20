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

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Episode;
use App\Entity\Season;
use App\Entity\TracklistEpisode;
use PHPUnit\Framework\TestCase;
use DateTime;
use Doctrine\Common\Collections\ArrayCollection;

class EpisodeTest extends TestCase
{
    public function testSetAndGetTmdbEpisodeID(): void
    {
        // Arrange
        $episode = new Episode();
        $tmdbEpisodeID = 12345;

        // Act
        $episode->setTmdbEpisodeID($tmdbEpisodeID);

        // Assert
        $this->assertSame($tmdbEpisodeID, $episode->getTmdbEpisodeID());
    }

    public function testSetAndGetName(): void
    {
        $episode = new Episode();
        $name = 'Test Episode';
        
        $episode->setName($name);
        
        $this->assertSame($name, $episode->getName());
    }

    public function testSetAndGetOverview(): void
    {
        $episode = new Episode();
        $overview = 'This is a test overview.';
        
        $episode->setOverview($overview);
        
        $this->assertSame($overview, $episode->getOverview());
    }

    public function testSetAndGetEpisodeNumber(): void
    {
        $episode = new Episode();
        $episodeNumber = 10;
        
        $episode->setEpisodeNumber($episodeNumber);
        
        $this->assertSame($episodeNumber, $episode->getEpisodeNumber());
    }

    public function testSetAndGetRuntime(): void
    {
        $episode = new Episode();
        $runtime = 45;
        
        $episode->setRuntime($runtime);
        
        $this->assertSame($runtime, $episode->getRuntime());
    }

    public function testSetAndGetAirDate(): void
    {
        $episode = new Episode();
        $airDate = new DateTime('2024-01-01');
        
        $episode->setAirDate($airDate);
        
        $this->assertSame($airDate, $episode->getAirDate());
    }

    public function testTracklistEpisodesCollection(): void
    {
        $episode = new Episode();
        $tracklistEpisode = $this->createMock(TracklistEpisode::class);
        
        $episode->addTracklistEpisode($tracklistEpisode);
        
        $this->assertTrue($episode->getTracklistEpisodes()->contains($tracklistEpisode));
        
        $episode->removeTracklistEpisode($tracklistEpisode);
        
        $this->assertFalse($episode->getTracklistEpisodes()->contains($tracklistEpisode));
    }

    public function testSetAndGetStillPath(): void
    {
        $episode = new Episode();
        $stillPath = '/path/to/image.jpg';
        
        $episode->setStillPath($stillPath);
        
        $this->assertSame($stillPath, $episode->getStillPath());
    }

    public function testSetAndGetSeason(): void
    {
        $episode = new Episode();
        $season = $this->createMock(Season::class);
        
        $episode->setSeason($season);
        
        $this->assertSame($season, $episode->getSeason());
    }
}