<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace App\Controller\API\User;

use App\Security\IsAuthenticated;
use App\Service\User\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    public function __construct(
        private readonly UserService $userService
    ){}

    /**
     * @example DELETE /api/user
     *          Header: Authorization: Bearer <JWT-TOKEN>
     *          Body (JSON):
     *          {
     *              "security_question": "Was ist Ihre Lieblingsfilm bzw. Ihre Lieblingsserie?",
     *              "security_answer": "Frieren"
     *          }
     * @header Bearer Token
     * @param Request $request
     * @return JsonResponse
     * @response 200 {"message": "User deleted successfully"}
     * @response 401 {"error": "Invalid request"}
     */
    #[IsAuthenticated]
    #[Route('/api/user', name: 'user_delete', methods: ['DELETE'])]
    public function deleteUser(Request $request): JsonResponse
    {
        $response = $this->userService->deleteUser($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['message']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     * @response 200 {"message": "Password successfully changed"}
     * @response 401 {"error": "Invalid request"}
     * @header Bearer Token
     * @example POST /api/user
     *           Header: Authorization: Bearer <JWT-TOKEN>
     *           Body (JSON):
     *           {
     *               "security_question": "Was ist Ihre Lieblingsfilm bzw. Ihre Lieblingsserie?",
     *               "security_answer": "Frieren",
     *               "new_password": "newPassword123"
     *           }
     */
    #[IsAuthenticated]
    #[Route('/api/user', name: 'user_change_password', methods: ['POST'])]
    public function changePassword(Request $request): JsonResponse
    {
        $response = $this->userService->changePassword($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['message']);
    }
}
