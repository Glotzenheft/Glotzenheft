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

namespace App\Service\Authorization;

use App\Entity\User;
use App\Enum\SecurityQuestions;
use App\Service\RequestTrait;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\JWT\JWT;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthorizationService
{
    use RequestTrait;

    private string $projectDir;

    private bool $hasError = false;

    public function __construct
    (
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ContainerBagInterface $params
    )
    {
        try
        {
            $this->projectDir = $params->get('kernel.project_dir');
        }
        catch (NotFoundExceptionInterface|ContainerExceptionInterface $exception)
        {
            $this->hasError = true;
        }
    }

    /**
     * @param Request $request
     * @return array
     */
    public function registerUser(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        if (!isset(
            $this->data['user_name'],
            $this->data['user_password'],
            $this->data['security_question'],
            $this->data['security_answer'],
            $this->data['terms_accepted'],
            )
        )
        {
            return $this->returnInvalidRequest();
        }

        $termsAccepted = $this->data['terms_accepted'];
        if ($termsAccepted !== true)
        {
            return $this->returnTermsNotAccepted();
        }

        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->data['user_name']]);
        if ($existingUser instanceof User)
        {
            return $this->returnUserAlreadyExists();
        }

        $securityQuestionEnum = SecurityQuestions::tryFrom($this->data['security_question']);
        if (!$securityQuestionEnum)
        {
            return $this->returnInvalidSecurityQuestion();
        }

        // Neuen User anlegen
        $user = new User();
        $user->setUsername($this->data['user_name']);

        // Passwort hashen
        $hashedPassword = $this->passwordHasher->hashPassword($user, $this->data['user_password']);
        $user->setPassword($hashedPassword);

        // Sicherheitsfrage setzen
        $user->setSecurityQuestion($securityQuestionEnum);

        // Sicherheitsantwort hashen
        $hashedAnswer = $this->passwordHasher->hashPassword($user, $this->data['security_answer']);
        $user->setSecurityAnswer($hashedAnswer);

        $user->setTermsAccepted($this->data['terms_accepted']);
        $user->setTermsAcceptedAt(new DateTimeImmutable());

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $newUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->data['user_name']]);
        if (!$newUser instanceof User)
        {
            return $this->returnDatabaseError();
        }

        return $this->returnUserRegisteredSuccessfully();
    }

    /**
     * @param Request $request
     * @return array
     */
    public function loginUser(Request $request): array
    {
        $this->data = $this->handleRequest($request);

        if (!isset(
            $this->data['user_name'],
            $this->data['user_password'],
            )
        )
        {
            return $this->returnInvalidRequest();
        }

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->data['user_name']]);
        if (!$user instanceof User || !$this->passwordHasher->isPasswordValid($user, $this->data['user_password']))
        {
            return $this->returnInvalidCredentials();
        }
        $user->setLastLogin(new DateTimeImmutable());
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        if ($this->hasError)
        {
            return $this->returnInternalServerError();
        }

        $privateKeyPath = $this->projectDir . '/config/private.pem';
        $privateKey = file_get_contents($privateKeyPath);
        $payload = [
            'sub' => $user->getId(),  // User-ID als Subject
            'username' => $user->getUsername(),
            'iat' => time(),
            'exp' => time() + (604800 * 4), // 4 Woche gültig
        ];
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        return [
            'message' => 'Login successful',
            'token' => $jwt,
        ];
    }
}