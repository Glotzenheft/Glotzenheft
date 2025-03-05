<?php

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