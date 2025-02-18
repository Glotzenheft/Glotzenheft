<?php declare(strict_types=1);

namespace App\Service\User;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

readonly class UserService
{
    public function __construct
    (
        private EntityManagerInterface $entityManager
    )
    {
    }

    public function deleteUser(Request $request): array
    {
        $data = $this->handleRequest($request);
        if (!isset($data['user_id'], $data['security_question'], $data['security_answer']))
        {
            return $this->returnInvalidRequest();
        }

        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
        if (!$user instanceof User)
        {
            return $this->returnInvalidRequest();
        }

        $securityQuestion = $user->getSecurityQuestion()->value;
        if ($securityQuestion !== $data['security_question'])
        {
            return $this->returnInvalidRequest();
        }

        $securityAnswer = $data['security_answer'];
        if (!$securityAnswer || !password_verify($securityAnswer, $user->getSecurityAnswer()))
        {
            return $this->returnInvalidRequest();
        }

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
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

    private function handleRequest(Request $request): array
    {
        $body = json_decode($request->getContent(), true);

        $userID = $request->attributes->get('user_id') !== null
            ? $request->attributes->get('user_id')
            : null;
        $userSecurityQuestion = $body['security_question'] ?? null;
        $userSecurityAnswer = $body['security_answer'] ?? null;

        return [
            'user_id' => $userID,
            'security_question' => $userSecurityQuestion,
            'security_answer' => $userSecurityAnswer,
        ];
    }

    private function returnInvalidRequest(): array
    {
        return [
            'error' => 'Invalid request',
            'code' => 401,
        ];
    }
}