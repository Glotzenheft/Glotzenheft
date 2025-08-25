<?php declare(strict_types=1);

namespace App\Model\Request\Recommendation;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class MovieRecommendationDto
{
    public function __construct(
        #[SerializedName('tmdb_movie_id')]
        #[Assert\NotBlank(
            message: 'Tmdb movie id parameter "tmdb_movie_id" is required.'
        )]
        public ?int $tmdbMovieId = null,
        public ?string $language = 'de-DE',
        #[Assert\Range(
            minMessage: 'Page number must be at least 1.',
            min: 1
        )]
        public int $page = 1,
    ){}
}