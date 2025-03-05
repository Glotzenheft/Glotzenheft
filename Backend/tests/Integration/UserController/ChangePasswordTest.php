<?php declare(strict_types=1);

namespace App\Tests\Integration\UserController;

use App\Entity\User;
use App\Tests\Integration\IntegrationTestTrait\TestUserTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ChangePasswordTest extends WebTestCase
{
    use TestUserTrait;

    protected function setUp(): void
    {
        $this->setUpTestUserTrait();
        $this->loginUser();
    }

    public function testChangePassword(): void
    {
        // Arrange
        $changePasswordData = [
            'security_question' => $this->user->getSecurityQuestion()->value,
            'security_answer' => $this->securityAnswer,
            'new_password' => '123456767!',
        ];

        // Act
        $this->client->request(
            'POST',
            '/api/user',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Authorization' => 'Bearer ' . $this->token,
            ],
            json_encode($changePasswordData)
        );
        $changePasswordResponse = json_decode($this->client->getResponse()->getContent(), true);

        //Assert
        $this->assertResponseIsSuccessful('Password change failed');
        $this->assertEquals('Password successfully changed', $changePasswordResponse ?? '', 'Unexpected password change message');

        echo PHP_EOL . 'User password changed successfully.' . PHP_EOL;
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