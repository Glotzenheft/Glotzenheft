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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Controller\API\User;

use App\Security\IsAuthenticated;
use App\Service\RequestTrait;
use App\Service\User\UserActivityService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserActivityController extends AbstractController
{

    public function __construct(
        private readonly UserActivityService $userActivityService
    ){}

    /**
     * Retrieves the latest user activities, which are watched episodes and completed movies.
     *
     * This endpoint returns a paginated list of the most recent activities of a user,
     * such as episodes they have watched and movies they have completed.
     *
     * Authentication:
     * - Requires a Bearer Token in the `Authorization` header.
     *
     * Headers:
     * - `Authorization: Bearer <token>` (required) - A valid JWT for authentication.
     *
     * Query Parameters:
     * - `user_activity_page` (int, optional, default: 1): The page number for pagination.
     *
     *  Example request:
     *  GET https://127.0.0.1:8000/api/user-activities?user_activity_page=1
     *  Authorization: Bearer jwt_token
     *
     *  Response:
     *  - 200 OK: Returns an array of user activities.
     *  - 401 Unauthorized: If the Authorization header is missing or the token is invalid.
     *  - 404 Not Found: If the user does not exist.
     *  - 500 Internal Server Error: If a database error occurs.
     * @param Request $request The incoming HTTP request.
     * @return JsonResponse The JSON response containing the user activities or an error message.
     */
    #[IsAuthenticated]
    #[Route('/api/user-activities', name:'get_user_activities', methods: ['GET'])]
    public function getLastActivities(Request $request): JsonResponse
    {
        $response = $this->userActivityService->getUserActivities($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], $response['code']);
        }

        return $this->json($response);
    }
}
