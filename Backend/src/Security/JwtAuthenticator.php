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

namespace App\Security;

use Exception;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use ReflectionException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use ReflectionMethod;

readonly class JwtAuthenticator
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        #[Autowire('%env(resolve:JWT_PUBLIC_KEY_PATH)%')]
        private string $publicKeyPath,
        #[Autowire('%env(JWT_ALGORITHM)%')]
        private string $jwtAlgorithm = 'RS256'
    ){}

    public function onKernelController(ControllerEvent $event): void
    {
        if (!$this->isAuthenticationRequired($event->getController())) return;

        $jwt = $this->extractToken($event->getRequest());
        if (!$jwt)
        {
            $event->setController(fn () => new JsonResponse(
                ['error' => 'Missing or invalid Authorization header'],
                Response::HTTP_UNAUTHORIZED
            ));
            return;
        }

        try
        {
            $decoded = JWT::decode($jwt, new Key(file_get_contents($this->publicKeyPath), $this->jwtAlgorithm));
        }
        catch (ExpiredException)
        {
            $event->setController(fn() => new JsonResponse(
                ['error' => 'Token has expired'],
                Response::HTTP_UNAUTHORIZED
            ));
            return;
        }
        catch (Exception)
        {
            $event->setController(fn() => new JsonResponse(
                ['error' => 'Invalid token'],
                Response::HTTP_UNAUTHORIZED
            ));
            return;
        }

        $controller = $event->getController();

        if (is_array($controller))
        {
            [$controllerInstance, $method] = $controller;
        }
        else
        {
            return;
        }

        try
        {
            $reflection = new ReflectionMethod($controllerInstance, $method);
            if (!$reflection->getAttributes(IsAuthenticated::class)) return;
        }
        catch (ReflectionException $e)
        {
            $event->setController(fn () => new JsonResponse(
                ['error' => 'Internal error: ' . $e->getMessage()],
                Response::HTTP_INTERNAL_SERVER_ERROR
            ));
        }

        $user = $this->entityManager->getRepository(User::class)->find($decoded->sub);
        if (!$user)
        {
            $event->setController(fn () => new JsonResponse(['error' => 'User in token not found'], Response::HTTP_UNAUTHORIZED));
            return;
        }

        $event->getRequest()->attributes->set('user_id', $user->getId());
        $event->getRequest()->attributes->set('username', $user->getUsername());
    }

    /**
     * @param callable|object $controller
     * @return bool
     */
    private function isAuthenticationRequired(callable|object $controller): bool
    {
        if (!is_array($controller)) return false;

        try
        {
            $reflection = new ReflectionMethod($controller[0], $controller[1]);
            return count($reflection->getAttributes(IsAuthenticated::class)) > 0;
        }
        catch (ReflectionException)
        {
            return false;
        }
    }

    /**
     * @param Request $request
     * @return string|null
     */
    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer '))
        {
            return null;
        }
        return substr($authHeader, 7);
    }
}