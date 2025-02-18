<?php declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    private array $data;
    public function __construct
    (
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher
    )
    {
    }

    /**
     * @param Request $request
     * @return array
     */
    public function deleteUser(Request $request): array
    {
        $this->data = $this->handleRequest($request);
        $isValid = $this->validateRequest();
        if (!$isValid)
        {
            return $this->returnInvalidRequest();
        }

        $this->entityManager->remove($this->data['user']);
        $this->entityManager->flush();

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if ($user instanceof User)
        {
            return [
                'error' => 'There was an error while deleting the user. Please try again.',
                'code' => 403,
            ];
        }

        return [
            'message' => 'User deleted successfully'
        ];
    }

    /**
     * @param Request $request
     * @return array
     */
    public function changePassword(Request $request): array
    {
        $this->data = $this->handleRequest($request);
        $isValid = $this->validateRequest();
        if (!$isValid || !isset($this->data['new_password']))
        {
            return $this->returnInvalidRequest();
        }

        $hashedPassword = $this->passwordHasher->hashPassword($this->data['user'], $this->data['new_password']);
        $this->data['user']->setPassword($hashedPassword);

        $this->entityManager->persist($this->data['user']);
        $this->entityManager->flush();

        if ($this->data['user']->getPassword() !== $hashedPassword)
        {
            return [
                'error' => 'There was an error while changing the password. Please try again.',
                'code' => 403,
            ];
        }

        return [
            'message' => 'Password successfully changed'
        ];
    }

    private function handleRequest(Request $request): array
    {
        $body = json_decode($request->getContent(), true);

        $userID = $request->attributes->get('user_id') !== null
            ? $request->attributes->get('user_id')
            : null;
        $userSecurityQuestion = $body['security_question'] ?? null;
        $userSecurityAnswer = $body['security_answer'] ?? null;
        $newPassword = $body['new_password'] ?? null;

        return [
            'user_id' => $userID,
            'security_question' => $userSecurityQuestion,
            'security_answer' => $userSecurityAnswer,
            'new_password' => $newPassword,
        ];
    }

    private function validateRequest(): bool
    {
        if (!isset($this->data['user_id'], $this->data['security_question'], $this->data['security_answer']))
        {
            return false;
        }

        $user = $this->entityManager->getRepository(User::class)->find($this->data['user_id']);
        if (!$user instanceof User)
        {
            return false;
        }
        $this->data['user'] = $user;

        $securityQuestion = $user->getSecurityQuestion()->value;
        if ($securityQuestion !== $this->data['security_question'])
        {
            return false;
        }

        $securityAnswer = $this->data['security_answer'];
        if (!$securityAnswer || !password_verify($securityAnswer, $user->getSecurityAnswer()))
        {
            return false;
        }

        return true;
    }

    private function returnInvalidRequest(): array
    {
        return [
            'error' => 'Invalid request',
            'code' => 401,
        ];
    }
}