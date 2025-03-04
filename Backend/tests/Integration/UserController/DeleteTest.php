<?php declare(strict_types=1);

namespace App\Tests\Integration\UserController;

use App\Tests\Integration\IntegrationTestTrait\TestUserTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class DeleteTest extends WebTestCase
{
    use TestUserTrait;

    protected function setUp(): void
    {
        $this->setUpTestUserTrait();
        $this->loginUser();
    }

    public function testUserDelete(): void
    {
        // Arrange
        $deleteData = [
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->securityAnswer,
        ];

        // Act
        $this->client->request(
            'DELETE',
            '/api/user',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Authorization' => 'Bearer ' . $this->token,
            ],
            json_encode($deleteData)
        );
        $deleteResponse = json_decode($this->client->getResponse()->getContent(), true);


        // Assert
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User deletion failed');
        $this->assertEquals('User deleted successfully', $deleteResponse ?? '', 'Unexpected deletion message');

        echo PHP_EOL . 'User deletion successful.' . PHP_EOL;
    }
}