<?php

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
