<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
