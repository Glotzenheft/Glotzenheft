<?php declare(strict_types=1);

namespace App\Model\Request\Recommendation;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TVSeriesRecommendationDto
{
    public function __construct(
        #[SerializedName('tmdb_series_id')]
        #[Assert\NotBlank(
            message: 'Tmdb series id parameter "tmdb_series_id" is required.'
        )]
        public ?int $tmdbSeriesId = null,
        public ?string $language = 'de-DE',
    ){}
}