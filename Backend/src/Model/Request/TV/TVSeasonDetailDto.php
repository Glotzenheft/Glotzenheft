<?php

declare(strict_types=1);

namespace App\Model\Request\TV;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TVSeasonDetailDto
{
    public function __construct(
        #[SerializedName('tmdb_id')]
        #[Assert\NotBlank(message: 'Parameter "tmdb_id" is required.')]
        #[Assert\Type(type: 'integer')]
        #[Assert\Positive(message: 'Parameter "tmdb_id" must be a positive number.')]
        public int $tmdbId,

        #[SerializedName('season_number')]
        #[Assert\NotBlank(message: 'Parameter "season_number" is required.')]
        #[Assert\Type(type: 'integer')]
        #[Assert\GreaterThanOrEqual(value: 0, message: 'Parameter "season_number" must be 0 or greater.')]
        public int $seasonNumber,

        public string $language = 'de-DE',
        #[SerializedName('append_to_response')]
        public ?string $appendToResponse = null,
    ) {}
}