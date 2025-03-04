<?php declare(strict_types=1);

namespace App\Tests\Integration\AuthorizationController;

use App\Entity\User;
use App\Tests\Integration\IntegrationTestTrait\TestUserTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class LoginTest extends WebTestCase
{
    use TestUserTrait;

    protected function setUp(): void
    {
        $this->setUpTestUserTrait();
    }
    public function testLogin(): void
    {
        // Arrange
        $loginData = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        // Act
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $loginResponse = json_decode($this->client->getResponse()->getContent(), true);

        // Assert
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User login failed');
        $this->assertArrayHasKey('token', $loginResponse, 'No token received after login');

        echo PHP_EOL . 'User login successful.' . PHP_EOL;
    }

    public function testLoginWithInvalidCredentials(): void
    {
        // Arrange
        $invalidLoginData = [
            'username' => $this->username,
            'password' => '11111111',
        ];

        // Act
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($invalidLoginData));

        // Assert
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED, 'Invalid credentials should not allow login');

        echo PHP_EOL . 'User login successfully failed due to invalid credentials.' . PHP_EOL;
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

                echo PHP_EOL . 'Testuser deleted.' . PHP_EOL;
            }
        }

        parent::tearDown();
    }
}
