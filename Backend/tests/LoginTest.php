<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class LoginTest extends WebTestCase
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
        $this->user->setUsername('testuser');
        $this->user->setPassword('SecurePassword123!');

    }
    public function testLogin(): void
    {
         // Login Request
        $loginData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
        ];
        
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User login failed');
        $loginResponse = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $loginResponse, 'No token received after login');
        echo "User login successful.\n";
    }
}
