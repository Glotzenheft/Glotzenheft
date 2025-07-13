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

namespace Tests\App\Entity;

use App\Entity\Media;
use App\Enum\MediaType;
use Doctrine\Common\Collections\ArrayCollection;
use PHPUnit\Framework\TestCase;

class MediaTest extends TestCase
{
    public function testSetAndGetTmdbID(): void
    {
        // Arrange
        $media = new Media();
        $tmdbID = 12345;

        // Act
        $media->setTmdbID($tmdbID);

        // Assert
        $this->assertEquals($tmdbID, $media->getTmdbID());
    }

    public function testSetAndGetImdbID(): void
    {
        // Arrange
        $media = new Media();
        $imdbID = 'tt1234567';

        // Act
        $media->setImdbID($imdbID);

        // Assert
        $this->assertEquals($imdbID, $media->getImdbID());
    }

    public function testSetAndGetName(): void
    {
        // Arrange
        $media = new Media();
        $name = 'Test Movie';

        // Act
        $media->setName($name);

        // Assert
        $this->assertEquals($name, $media->getName());
    }

    public function testSetAndGetDescription(): void
    {
        // Arrange
        $media = new Media();
        $description = 'This is a test description.';

        // Act
        $media->setDescription($description);

        // Assert
        $this->assertEquals($description, $media->getDescription());
    }

    public function testSetAndGetType(): void
    {
        // Arrange
        $media = new Media();
        $type = MediaType::Movie;

        // Act
        $media->setType($type);

        // Assert
        $this->assertEquals($type, $media->getType());
    }

    public function testConstructorInitializesCollections(): void
    {
        // Arrange & Act
        $media = new Media();

        // Assert
        $this->assertInstanceOf(ArrayCollection::class, $media->getTmdbGenres());
        $this->assertInstanceOf(ArrayCollection::class, $media->getSeasons());
        $this->assertInstanceOf(ArrayCollection::class, $media->getTracklists());
    }
}