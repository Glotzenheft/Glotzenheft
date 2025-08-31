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

namespace App\Tests\Integration\Controller;

use App\Tests\Integration\IntegrationTestTrait\TestUserTrait;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class BackupControllerTest extends WebTestCase
{
    use TestUserTrait;

    protected function setUp(): void
    {
        $this->setUpTestUserTrait();
        $this->loginUser();
    }

    public function testListBackupsReturnsOk(): void
    {
        // Arrange
        // User is logged in via setUp.

        // Act
        $this->client->request('GET', '/api/backups', [], [], $this->getAuthHeaders());

        // Assert
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('Content-Type', 'application/json');
    }

    public function testCreateBackupReturnsAccepted(): void
    {
        // Arrange
        // User is logged in via setUp.

        // Act
        $this->client->request('POST', '/api/backups', [], [], $this->getAuthHeaders());

        // Assert
        $this->assertResponseStatusCodeSame(Response::HTTP_ACCEPTED);
    }

    // A full test suite would also test the import and download endpoints
    // with file uploads and proper authorization checks.
}
