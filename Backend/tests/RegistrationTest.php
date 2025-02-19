<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Enum\SecurityQuestions;

class RegistrationTest extends WebTestCase
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        // Create test user object
        $this->user = new User();
        $this->user->setUsername('testuser3');
        $this->user->setPassword('SecurePassword123!');
        $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
        $this->user->setSecurityAnswer('Grey');
    }
    public function testRegistration(): void
    {
         
        $userData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->user->getSecurityAnswer(),
        ];

        // Registration Request
        $this->client->request('POST', '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($userData));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User registration failed');
        $registerResponse = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $registerResponse, 'No token received after registration');
        echo "User registration successful.\n";
    }

    protected function tearDown(): void
    {
        // Cleanup: Delete test user
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->user->getUsername()]);
        if ($user) {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
            echo "Test user deleted.\n";
        }
    }
}
