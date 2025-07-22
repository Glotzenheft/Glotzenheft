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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

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
