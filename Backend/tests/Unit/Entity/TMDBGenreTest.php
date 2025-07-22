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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

namespace App\Tests\Unit\Entity;

use App\Entity\TMDBGenre;
use App\Entity\Media;
use PHPUnit\Framework\TestCase;

class TMDBGenreTest extends TestCase
{
    public function testSetAndGetTmdbGenreID(): void
    {
        // Arrange
        $genre = new TMDBGenre();

        // Act
        $genre->setTmdbGenreID(28);

        // Assert
        $this->assertEquals(28, $genre->getTmdbGenreID());
    }

    public function testSetAndGetName(): void
    {
        // Arrange
        $genre = new TMDBGenre();

        // Act
        $genre->setName('Action');

        // Assert
        $this->assertEquals('Action', $genre->getName());
    }

    public function testAddMedia(): void
    {
        // Arrange
        $genre = new TMDBGenre();
        $media = $this->createMock(Media::class);

        // Act
        $genre->addMedia($media);

        // Assert
        $this->assertTrue($genre->getMedia()->contains($media));
    }

    public function testRemoveMedia(): void
    {
        // Arrange
        $genre = new TMDBGenre();
        $media = $this->createMock(Media::class);

        $genre->addMedia($media);

        // Act
        $genre->removeMedia($media);

        // Assert
        $this->assertFalse($genre->getMedia()->contains($media));
    }
}
