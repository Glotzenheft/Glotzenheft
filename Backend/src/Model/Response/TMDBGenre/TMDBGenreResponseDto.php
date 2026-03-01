<?php

declare(strict_types=1);

namespace App\Model\Response\TMDBGenre;

use App\Entity\TMDBGenre;

readonly class TMDBGenreResponseDto
{
    public function __construct(
        public int $id,
        public int $tmdbGenreId,
        public string $name,
        public string $createdAt,
        public ?string $updatedAt,
    ){}

    /**
     * @param TMDBGenre $tmdbGenre
     * @return self
     */
    public static function fromEntity(TMDBGenre $tmdbGenre): self
    {
        return new self(
            id: $tmdbGenre->getId(),
            tmdbGenreId: $tmdbGenre->getTmdbGenreId(),
            name: $tmdbGenre->getName(),
            createdAt: $tmdbGenre->getCreatedAt()->format('Y-m-d H:i:s'),
            updatedAt: $tmdbGenre->getUpdatedAt()?->format('Y-m-d H:i:s'),
        );
    }
}