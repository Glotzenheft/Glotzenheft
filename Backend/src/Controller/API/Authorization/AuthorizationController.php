<?php

declare(strict_types=1);

namespace App\Controller\API\Authorization;

use App\Service\Authorization\AuthorizationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class AuthorizationController extends AbstractController
{
    public function __construct
    (
        private readonly AuthorizationService $authorizationService,
    )
    {
    }

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
}
