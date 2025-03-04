<?php declare(strict_types=1);

namespace App\Security;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use ReflectionException;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use ReflectionMethod;

readonly class JwtAuthenticator
{
    public function __construct
    (
        private EntityManagerInterface $entityManager,
        private ContainerBagInterface $params
    )
    {
    }

    /**
     * @throws ReflectionException
     */
    public function onKernelController(ControllerEvent $event): void
    {
        $controller = $event->getController();

        // Falls es sich um ein [Controller-Klasse, Methode] handelt, extrahieren
        if (is_array($controller))
        {
            [$controllerInstance, $method] = $controller;
        }
        else
        {
            return; // Falls es keine gültige Methode ist, einfach ignorieren
        }

        $reflection = new ReflectionMethod($controllerInstance, $method);

        // 🔥 Prüfen, ob die Methode das #[IsAuthenticated] Attribut hat
        if (!$reflection->getAttributes(IsAuthenticated::class))
        {
            return; // Falls nicht vorhanden, nichts tun
        }

        $request = $event->getRequest();
        $authHeader = $request->headers->get('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer '))
        {
            $event->setController(fn () => new JsonResponse(['error' => 'Missing or invalid Authorization header'], Response::HTTP_UNAUTHORIZED));
            return;
        }

        $jwt = substr($authHeader, 7); // "Bearer " entfernen
        try
        {
            $publicKeyPath = $this->params->get('kernel.project_dir') . '/config/public.pem';
            $publicKey = file_get_contents($publicKeyPath);
            $decoded = JWT::decode($jwt, new Key($publicKey, 'RS256'));

            // User anhand der ID laden
            $user = $this->entityManager->getRepository(User::class)->find($decoded->sub);
            if (!$user)
            {
                $event->setController(fn () => new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND));
                return;
            }

            // ✅ User-Daten in Request speichern
            $request->attributes->set('user_id', $user->getId());
            $request->attributes->set('username', $user->getUsername());

        }
        catch (Exception $e)
        {
            $event->setController(fn () => new JsonResponse(['error' => 'Invalid token: ' . $e->getMessage()], Response::HTTP_NOT_FOUND));
        }
        catch (NotFoundExceptionInterface|ContainerExceptionInterface $e)
        {
        }
    }
}