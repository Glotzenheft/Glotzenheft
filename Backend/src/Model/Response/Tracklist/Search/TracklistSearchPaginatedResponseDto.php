<?php declare(strict_types=1);

namespace App\Model\Response\Tracklist\Search;


use Symfony\Component\Serializer\Attribute\SerializedName;

readonly class TracklistSearchPaginatedResponseDto
{
    public function __construct(
        /** @var array<TracklistSearchResponseDto> */
        public array $results,
        public int   $page,
        #[SerializedName('total_results')]
        public int   $totalResults,
        #[SerializedName('total_pages')]
        public int   $totalPages,
    ){}
}