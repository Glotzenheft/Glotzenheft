<?php

declare(strict_types=1);

namespace App\Controller\API\Authorization;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthorizationController extends AbstractController
{
    private string $projectDir;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function __construct(ContainerBagInterface $params)
    {
        $this->projectDir = $params->get('kernel.project_dir');
    }

    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (!$username || !$password)
        {
            return new JsonResponse(['error' => 'Username and password are required'], 400);
        }

        // Prüfen, ob der User bereits existiert
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if ($existingUser instanceof User)
        {
            return new JsonResponse(['error' => 'User already exists'], 409);
        }

        // Neuen User anlegen
        $user = new User();
        $user->setUsername($username);
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        // JWT erstellen
        $privateKeyPath = $this->projectDir . '/config/private.pem';
        $privateKey = file_get_contents($privateKeyPath);
        $payload = [
            'sub' => $user->getId(),  // User-ID als Subject
            'username' => $user->getUsername(),
            'iat' => time(),
            'exp' => time() + 604800, // 1 Woche gültig
        ];
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        return new JsonResponse([
            'message' => 'User registered successfully',
            'token' => $jwt,
        ]);
    }

    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, ContainerBagInterface $params): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (!$username || !$password)
        {
            return new JsonResponse(['error' => 'Username and password are required'], 400);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user instanceof User || !$passwordHasher->isPasswordValid($user, $password))
        {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // JWT erstellen
        $privateKeyPath = $this->projectDir . '/config/private.pem';
        $privateKey = file_get_contents($privateKeyPath);
        $payload = [
            'sub' => $user->getId(),  // User-ID als Subject
            'username' => $user->getUsername(),
            'iat' => time(),
            'exp' => time() + 604800, // 1 Woche gültig
        ];
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        return new JsonResponse([
            'message' => 'Login successful',
            'token' => $jwt,
        ]);
    }
}
