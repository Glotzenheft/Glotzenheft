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

namespace App\Controller\API\Authorization;

use App\Security\IsAuthenticated;
use App\Service\Authorization\AuthorizationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class AuthorizationController extends AbstractController
{
    public function __construct(
        private readonly AuthorizationService $authorizationService,
    ){}

    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function registerUser(Request $request): JsonResponse
    {
        $response = $this->authorizationService->registerUser($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response['message'], (int) $response['code']);
    }

    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $response = $this->authorizationService->loginUser($request);

        if (isset($response['error']))
        {
            return $this->json($response['error'], (int) $response['code']);
        }

        return $this->json($response);
    }

    #[IsAuthenticated]
    #[Route('/api/auth/check', name: 'check_auth_token', methods: ['GET'])]
    public function checkAuthenticationEndpoint(): JsonResponse
    {
        return $this->json(['status' => 'Token is valid']);
    }
}
