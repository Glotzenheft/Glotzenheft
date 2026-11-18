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

namespace App\Service\User;

use App\Entity\User;
use App\Model\Request\User\UserActivitiesRequestDto;
use App\Model\Response\User\UserActivitiesResponseDto;
use App\Repository\WatchActivityRepository;

class UserActivityService
{
    private const int PAGE_SIZE = 50;

    public function __construct(private readonly WatchActivityRepository $watchActivityRepository)
    {
    }

    public function getUserActivities(User $user, UserActivitiesRequestDto $request): UserActivitiesResponseDto
    {
        $totalResults = $this->watchActivityRepository->countDatedByUser($user);
        $totalPages = (int) ceil($totalResults / self::PAGE_SIZE);
        $results = $request->page <= $totalPages
            ? $this->watchActivityRepository->findDatedByUser(
                $user,
                ($request->page - 1) * self::PAGE_SIZE,
                self::PAGE_SIZE,
            )
            : [];

        return new UserActivitiesResponseDto($request->page, $totalPages, $totalResults, $results);
    }
}
