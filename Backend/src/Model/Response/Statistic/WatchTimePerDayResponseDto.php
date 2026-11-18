<?php
declare(strict_types=1);

namespace App\Model\Response\Statistic;

final readonly class WatchTimePerDayResponseDto
{
    /** @param array<string, int> $minutesByDay */
    public function __construct(
        public int $unknownDateMinutes,
        public array $minutesByDay,
    ){}

    /** @return array<string, int> */
    public function toArray(): array
    {
        return ['unknown_date' => $this->unknownDateMinutes] + $this->minutesByDay;
    }
}
