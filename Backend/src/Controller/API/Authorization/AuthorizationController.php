<?php

declare(strict_types=1);

namespace App\Controller\API\Authorization;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthorizationController extends AbstractController
{
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
        $privateKeyPath = __DIR__ . '/../../../../config/private.pem';
        $privateKey = file_get_contents($privateKeyPath);
        $payload = [
            'sub' => $user->getId(),  // User-ID als Subject
            'username' => $user->getUsername(),
            'iat' => time(),
            'exp' => time() + 3600, // 1 Stunde gültig
        ];
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        return new JsonResponse([
            'message' => 'User registered successfully',
            'token' => $jwt,
        ]);
    }

    #[Route('/api/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (!$username || !$password)
        {
            return new JsonResponse(['error' => 'Username and password are required'], 400);
        }

        // User aus der Datenbank holen
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // Passwort überprüfen
        if (!$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Invalid credentials'], 401);
        }

        // JWT erstellen
        $privateKeyPath = __DIR__ . '/../../../../config/private.pem';
        $privateKey = file_get_contents($privateKeyPath);
        $payload = [
            'sub' => $user->getId(),  // User-ID als Subject
            'username' => $user->getUsername(),
            'iat' => time(),
            'exp' => time() + 3600, // 1 Stunde gültig
        ];
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        return new JsonResponse([
            'message' => 'Login successful',
            'token' => $jwt,
        ]);
    }
}
