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