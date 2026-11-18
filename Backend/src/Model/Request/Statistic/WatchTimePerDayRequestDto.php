<?php
declare(strict_types=1);

namespace App\Model\Request\Statistic;

use DateMalformedStringException;
use DateTimeImmutable;
use Symfony\Component\Serializer\Attribute\SerializedName;

final readonly class WatchTimePerDayRequestDto
{
    public function __construct(
        #[SerializedName('period_start_date')]
        public ?string $periodStartDate = null,
        #[SerializedName('period_end_date')]
        public ?string $periodEndDate = null,
    ){}

    /**
     * @throws DateMalformedStringException
     */
    public function startOfPeriod(): DateTimeImmutable
    {
        return (new DateTimeImmutable($this->periodStartDate ?: '0001-01-01'))->setTime(0, 0);
    }

    /**
     * @throws DateMalformedStringException
     */
    public function endOfPeriod(): DateTimeImmutable
    {
        return (new DateTimeImmutable($this->periodEndDate ?: 'now'))->setTime(23, 59, 59);
    }
}
