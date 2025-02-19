<?php declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use App\Service\RequestTrait;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    use RequestTrait;
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
            return $this->returnUserDeleteError();
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
            return $this->returnPasswordChangeError();
        }

        return [
            'message' => 'Password successfully changed'
        ];
    }
}