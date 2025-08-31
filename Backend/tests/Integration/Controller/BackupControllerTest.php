<?php

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
