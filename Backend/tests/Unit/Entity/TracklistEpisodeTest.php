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
