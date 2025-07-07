<?php declare(strict_types=1);

namespace App\Model\Request\Search;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class TvSearchRequestDto
{
    public function __construct(
        #[Assert\NotBlank(
            message: 'Search query parameter "q" is required.'
        )]
        public ?string $q = null,
        #[Assert\Range(
            notInRangeMessage: 'The year must be between 1000 and 9999.',
            min: 1000,
            max: 9999
        )]
        #[SerializedName('first_air_date_year')]
        public ?int $firstAirDateYear = null,
        #[SerializedName('include_adult')]
        public bool $includeAdult = true,
        public string $language = 'de-DE',
        #[Assert\Range(
            minMessage: 'Page number must be at least 1.',
            min: 1
        )]
        public int $page = 1,
        #[Assert\Range(
            notInRangeMessage: 'The year must be between 1000 and 9999.',
            min: 1000,
            max: 9999
        )]
        public ?int $year = null
    ){}
}