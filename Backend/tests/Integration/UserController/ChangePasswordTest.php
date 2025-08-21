<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

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