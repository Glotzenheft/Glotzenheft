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
use App\Enum\MediaType;
use App\Model\Request\User\ActivityPageRequestDto;
use DateTimeImmutable;
use App\Model\Request\User\UserActivitiesRequestDto;
use App\Model\Response\User\UserActivitiesResponseDto;
use App\Repository\WatchActivityRepository;

class UserActivityService
{
    public function __construct(private readonly WatchActivityRepository $watchActivityRepository)
    {
    }

    public function getUserActivities(User $user, UserActivitiesRequestDto $request): UserActivitiesResponseDto
    {
        return $this->getPage($user, $request, $request->mediaType, null);
    }

    public function getMediaActivities(User $user, ActivityPageRequestDto $request, MediaType $type, int $mediaId): UserActivitiesResponseDto
    {
        return $this->getPage($user, $request, $type, $mediaId);
    }

    private function getPage(User $user, ActivityPageRequestDto $request, ?MediaType $type, ?int $mediaId): UserActivitiesResponseDto
    {
        $search = trim($request->search);
        $totalResults = $this->watchActivityRepository->countDatedByUser($user, $type, $mediaId, $search);
        $totalPages = (int) ceil($totalResults / $request->itemsPerPage);
        $results = $request->page <= $totalPages
            ? $this->watchActivityRepository->findDatedByUser(
                $user,
                ($request->page - 1) * $request->itemsPerPage,
                $request->itemsPerPage,
                $type,
                $mediaId,
                $search,
                $request->sortOrder,
            )
            : [];

        $days = [];
        if ($results !== []) {
            $first = new DateTimeImmutable($results[0]->date);
            $last = new DateTimeImmutable($results[array_key_last($results)]->date);
            $days = $this->watchActivityRepository->summarizeDays(
                $user,
                $type,
                $mediaId,
                min($first, $last)->setTime(0, 0),
                max($first, $last)->modify('tomorrow midnight'),
                $search,
            );
        }

        return new UserActivitiesResponseDto($request->page, $totalPages, $totalResults, $results, $days);
    }
}
