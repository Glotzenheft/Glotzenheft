<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

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
