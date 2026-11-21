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

namespace App\Service\Statistic;

use App\Entity\User;
use App\Model\Request\Statistic\WatchTimePerDayRequestDto;
use App\Model\Response\Statistic\UserRatingsResponseDto;
use App\Model\Response\Statistic\WatchTimePerDayResponseDto;
use App\Repository\TracklistRepository;
use App\Repository\WatchActivityRepository;
use DateMalformedStringException;

readonly class StatisticService
{
    public function __construct(
        private WatchActivityRepository $watchActivityRepository,
        private TracklistRepository     $tracklistRepository,
    ){}

    /**
     * @throws DateMalformedStringException
     */
    public function getWatchTimePerDay(User $user, WatchTimePerDayRequestDto $request): WatchTimePerDayResponseDto
    {
        $rows = $this->watchActivityRepository->sumWatchTimeByDay(
            $user,
            $request->startOfPeriod(),
            $request->endOfPeriod(),
        );

        $unknownDateMinutes = 0;
        $minutesByDay = [];
        foreach ($rows as $row) {
            if ($row['day'] === null) {
                $unknownDateMinutes = (int) $row['minutes'];
            } else {
                $minutesByDay[$row['day']] = (int) $row['minutes'];
            }
        }

        return new WatchTimePerDayResponseDto($unknownDateMinutes, $minutesByDay);
    }

    public function getUserRatings(User $user): UserRatingsResponseDto
    {
        $unratedCount = 0;
        $countsByRating = [];
        foreach ($this->tracklistRepository->countByRating($user) as $row) {
            if ($row['rating'] === null) {
                $unratedCount = (int) $row['ratingCount'];
            } else {
                $countsByRating[(int) $row['rating']] = (int) $row['ratingCount'];
            }
        }

        return new UserRatingsResponseDto($unratedCount, $countsByRating);
    }
}
