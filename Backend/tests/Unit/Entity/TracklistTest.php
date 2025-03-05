<?php

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
