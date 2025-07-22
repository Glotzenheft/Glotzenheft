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

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Tracklist;
use App\Entity\Media;
use App\Entity\User;
use App\Enum\TracklistStatus;
use DateTime;
use PHPUnit\Framework\TestCase;

class TracklistTest extends TestCase
{
    public function testTracklistInitialization(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        
        // Act & Assert
        $this->assertNull($tracklist->getId());
        $this->assertNull($tracklist->getMedia());
        $this->assertNull($tracklist->getUser());
        $this->assertNull($tracklist->getRating());
        $this->assertNull($tracklist->getStatus());
        $this->assertNull($tracklist->getStartDate());
        $this->assertNull($tracklist->getFinishDate());
        $this->assertNull($tracklist->getTracklistName());
        $this->assertCount(0, $tracklist->getTracklistSeasons());
    }

    public function testSetAndGetMedia(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $media = $this->createMock(Media::class);

        // Act
        $tracklist->setMedia($media);

        // Assert
        $this->assertSame($media, $tracklist->getMedia());
    }

    public function testSetAndGetUser(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $user = $this->createMock(User::class);

        // Act
        $tracklist->setUser($user);

        // Assert
        $this->assertSame($user, $tracklist->getUser());
    }

    public function testSetAndGetRating(): void
    {
        // Arrange
        $tracklist = new Tracklist();

        // Act
        $tracklist->setRating(5);

        // Assert
        $this->assertSame(5, $tracklist->getRating());
    }

    public function testSetAndGetStatus(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $status = TracklistStatus::COMPLETED;

        // Act
        $tracklist->setStatus($status);

        // Assert
        $this->assertSame($status, $tracklist->getStatus());
    }

    public function testSetAndGetStartDate(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $date = new DateTime('2024-01-01');

        // Act
        $tracklist->setStartDate($date);

        // Assert
        $this->assertSame($date, $tracklist->getStartDate());
    }

    public function testSetAndGetFinishDate(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $date = new DateTime('2024-12-31');

        // Act
        $tracklist->setFinishDate($date);

        // Assert
        $this->assertSame($date, $tracklist->getFinishDate());
    }

    public function testSetAndGetTracklistName(): void
    {
        // Arrange
        $tracklist = new Tracklist();
        $name = 'My Favorite Tracks';

        // Act
        $tracklist->setTracklistName($name);

        // Assert
        $this->assertSame($name, $tracklist->getTracklistName());
    }
}
