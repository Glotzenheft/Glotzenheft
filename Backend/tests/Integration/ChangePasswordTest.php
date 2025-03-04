<?php declare(strict_types=1);

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Enum\SecurityQuestions;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ChangePasswordTest extends WebTestCase
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    private string $securityAnswer;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        // Create test user object
        $username = 'testuser';
        $this->securityAnswer = 'Grey';
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user instanceof User)
        {
            $this->user = new User();
            $this->user->setUsername($username);
            $hashedPassword = $passwordHasher->hashPassword($this->user, '123456677!');
            $this->user->setPassword($hashedPassword);
            $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
            $hashedSecurityAnswer = $passwordHasher->hashPassword($this->user, $this->securityAnswer);
            $this->user->setSecurityAnswer($hashedSecurityAnswer);
            $this->entityManager->persist($this->user);
            $this->entityManager->flush();
        }
        else
        {
            $this->user = $user;
        }
    }

    public function testChangePassword(): void
    {
        // Log in to get JWT token
        $loginData = [
            'username' => $this->user->getUsername(),
            'password' => '123456677!',
        ];

        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $this->assertResponseIsSuccessful('Login failed!');
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $token = $responseData['token'] ?? '';

        $changePasswordData = [
            'security_question' => $this->user->getSecurityQuestion()->value,
            'security_answer' => $this->securityAnswer,
            'new_password' => '123456767!',
        ];

        $this->client->request(
            'POST',
            '/api/user',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Authorization' => 'Bearer ' . $token,
            ],
            json_encode($changePasswordData)
        );

        $this->assertResponseIsSuccessful('Password change failed');
        $changePasswordResponse = json_decode($this->client->getResponse()->getContent(), true);
        // Antwort kommt mit zwei Anführungszeichen
        if (!is_array($changePasswordResponse))
        {
            $changePasswordResponse = ['message' => trim($this->client->getResponse()->getContent(), '"')];
        }
        $this->assertEquals('Password successfully changed', $changePasswordResponse['message'] ?? '', 'Unexpected password change message');
        echo "User password changed successfully.\n";
    }

    public function tearDown(): void
    {
        if ($this->user instanceof User)
        {
            $managedUser = $this->entityManager->find(User::class, $this->user->getId());
            if ($managedUser)
            {
                $this->entityManager->remove($managedUser);
                $this->entityManager->flush();
            }
        }

        parent::tearDown();
    }

}