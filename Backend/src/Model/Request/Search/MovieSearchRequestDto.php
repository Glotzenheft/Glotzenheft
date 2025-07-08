<?php declare(strict_types=1);

namespace App\Model\Request\Search;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class MovieSearchRequestDto
{
    public function __construct(
        #[Assert\NotBlank(
            message: 'Search query parameter "q" is required.'
        )]
        public ?string $q = null,
        #[SerializedName('include_adult')]
        public bool $includeAdult = true,
        public string $language = 'de-DE',
        #[SerializedName('primary_release_year')]
        public ?string $primaryReleaseYear = null,
        #[Assert\Range(
            minMessage: 'Page number must be at least 1.',
            min: 1
        )]
        public int $page = 1,
        public ?string $region = null,
        public ?int $year = null
    ){}
}