<?php
declare(strict_types=1);

namespace App\Model\Response\User;

use Symfony\Component\Serializer\Attribute\SerializedName;

final readonly class UserActivitiesResponseDto
{
    /** @param list<WatchActivityResponseDto> $results */
    public function __construct(
        public int $page,
        #[SerializedName('total_pages')]
        public int $totalPages,
        #[SerializedName('total_results')]
        public int $totalResults,
        public array $results,
    ){}
}
