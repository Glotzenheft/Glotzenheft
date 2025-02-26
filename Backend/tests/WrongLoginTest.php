<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class WrongLoginTest extends WebTestCase
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
        $this->user->setUsername('testuser5');
        $this->user->setPassword('123456677!');
    }
    public function testLoginWithInvalidCredentials(): void
    {
        
        $invalidLoginData = [
            'username' => $this->user->getUsername(),
            'password' => '11111111',
        ];
        
        // Failed Login Request
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($invalidLoginData));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED, 'Invalid credentials should not allow login');
        echo "User login failed due to invalid credentials.\n";
    }
}