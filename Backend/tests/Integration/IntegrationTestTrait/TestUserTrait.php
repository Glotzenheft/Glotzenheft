<?php declare(strict_types=1);

namespace App\Tests\Integration\IntegrationTestTrait;

use App\Entity\User;
use App\Enum\SecurityQuestions;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

trait TestUserTrait
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    private string $securityAnswer = 'Grey';
    private string $username = 'testuser';
    private string $password = 'p123456677!';

    private bool $termsAccepted = true;

    private ?string $token = null;

    public function setUpTestUserTrait(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        // Create test user object
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->username]);

        if (!$user instanceof User)
        {
            $this->user = new User();
            $this->user->setUsername($this->username);

            $hashedPassword = $passwordHasher->hashPassword($this->user, $this->password);
            $hashedSecurityAnswer = $passwordHasher->hashPassword($this->user, $this->securityAnswer);

            $this->user->setPassword($hashedPassword);
            $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
            $this->user->setSecurityAnswer($hashedSecurityAnswer);
            $this->user->setTermsAccepted($this->termsAccepted);
            $this->user->setTermsAcceptedAt(new DateTimeImmutable());

            $this->entityManager->persist($this->user);
            $this->entityManager->flush();
        }
        else
        {
            $this->user = $user;
        }
    }

    private function loginUser(): void
    {
        $loginData = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->token = $responseData['token'] ?? null;
    }

    protected function getAuthHeaders(): array
    {
        if (!$this->token)
        {
            throw new RuntimeException('No authentication token available. Did the login fail?');
        }

        return [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_Authorization' => 'Bearer ' . $this->token,
        ];
    }
}