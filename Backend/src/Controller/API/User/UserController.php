<?php

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
    public function __construct
    (
        private readonly UserService $userService
    )
    {
    }

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
