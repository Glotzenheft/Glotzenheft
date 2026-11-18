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

namespace App\Controller\API\User;

use App\Entity\User;
use App\Model\Request\User\UserActivitiesRequestDto;
use App\Security\IsAuthenticated;
use App\Service\User\UserActivityService;
use Doctrine\DBAL\Exception as DatabaseException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class UserActivityController extends AbstractController
{
    public function __construct(
        private readonly UserActivityService $userActivityService,
    ){}

    #[IsAuthenticated]
    #[Route(
        path:'/api/user-activities',
        name: 'get_user_activities',
        methods: ['GET'],
        stateless: true,
    )]
    public function getLastActivities(
        User $user,
        #[MapQueryString(validationFailedStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY)]
        UserActivitiesRequestDto $request = new UserActivitiesRequestDto(),
    ): JsonResponse
    {
        try {
            $response = $this->userActivityService->getUserActivities($user, $request);
        } catch (DatabaseException) {
            return $this->json('Database error occurred.', Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json($response);
    }
}
