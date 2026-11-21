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

namespace App\Controller\API\Statistic;

use App\Entity\User;
use App\Model\Request\Statistic\WatchTimePerDayRequestDto;
use App\Security\IsAuthenticated;
use App\Service\Statistic\StatisticService;
use DateMalformedStringException;
use Doctrine\DBAL\Exception as DatabaseException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class StatisticController extends AbstractController
{
    public function __construct(
        private readonly StatisticService $statisticService,
    ){}

    #[IsAuthenticated]
    #[Route(
        path:'/api/statistic/watchtime-per-day',
        name: 'watch_time_per_day',
        methods: ['GET'],
        stateless: true,
    )]
    public function getWatchTimePerDay(
        User $user,
        #[MapQueryString(validationFailedStatusCode: Response::HTTP_BAD_REQUEST)]
        WatchTimePerDayRequestDto $request = new WatchTimePerDayRequestDto(),
    ): JsonResponse
    {
        try {
            $response = $this->statisticService->getWatchTimePerDay($user, $request);
        } catch (DateMalformedStringException) {
            return $this->json(['error' => 'Invalid date provided. Use the following format: Y-m-d.'], Response::HTTP_BAD_REQUEST);
        } catch (DatabaseException) {
            return $this->json(['error' => 'Database error occurred.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($response->toArray());
    }

    #[IsAuthenticated]
    #[Route(
        path:'/api/statistic/user-ratings',
        name: 'user_ratings',
        methods: ['GET'],
        stateless: true,
    )]
    public function getUserRatings(User $user): JsonResponse
    {
        try {
            $response = $this->statisticService->getUserRatings($user);
        } catch (DatabaseException) {
            return $this->json(['error' => 'Database error occurred.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($response->toArray());
    }
}
