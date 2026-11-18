<?php
declare(strict_types=1);

namespace App\Model\Response\Statistic;

final readonly class UserRatingsResponseDto
{
    /** @param array<int, int> $countsByRating */
    public function __construct(
        public int $unratedCount,
        public array $countsByRating,
    ){}

    /** @return array<int|string, int> */
    public function toArray(): array
    {
        return ['no_rating' => $this->unratedCount] + $this->countsByRating;
    }
}
