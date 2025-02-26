<?php

declare(strict_types=1);

namespace App\Tests\Controller\API\User;

use App\Controller\API\User\UserController;
use App\Service\User\UserService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Enum\SecurityQuestions;

class UserControllerTest extends TestCase
{
    private UserController $controller;
    private UserService $userService;

    protected function setUp(): void
    {
        //self::bootKernel();
        //$container = static::getContainer();

        //$this->controller = $container->get(UserController::class);
        $this->userService = $this->createMock(UserService::class);
        $this->controller = new UserController($this->userService);

    }

    public function testDeleteUserSuccess(): void
    {
        // Arrange
        $request = new Request([], [], [], [], [], [], json_encode([
            'security_question' => SecurityQuestions::FAVORITE_MEDIA,
            'security_answer' => 'Frieren'
        ]));

        $this->userService->method('deleteUser')->willReturn(['message' => 'User deleted successfully']);

        // Act
        $response = $this->controller->deleteUser($request);
        echo $response->getContent();

        // Assert
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('User deleted successfully', $response->getContent());
    }

    public function testDeleteUserInvalidRequest(): void
    {
        // Arrange
        $request = new Request([], [], [], [], [], [], json_encode([]));

        $this->userService->method('deleteUser')->willReturn(['error' => 'Invalid request', 'code' => 401]);

        // Act
        $response = $this->controller->deleteUser($request);
        echo $response->getContent();

        // Assert
        $this->assertEquals(401, $response->getStatusCode());
        $this->assertStringContainsString('Invalid request', $response->getContent());
    }

    public function testChangePasswordSuccess(): void
    {
        // Arrange
        $request = new Request([], [], [], [], [], [], json_encode([
            'security_question' => SecurityQuestions::FAVORITE_MEDIA,
            'security_answer' => 'Frieren',
            'new_password' => 'newPassword123'
        ]));

        $this->userService->method('changePassword')->willReturn(['message' => 'Password successfully changed']);

        // Act
        $response = $this->controller->changePassword($request);
        echo $response->getContent();

        // Assert
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('Password successfully changed', $response->getContent());
    }

    public function testChangePasswordInvalidRequest(): void
    {
        // Arrange
        $request = new Request([], [], [], [], [], [], json_encode([]));

        $this->userService->method('changePassword')->willReturn(['error' => 'Invalid request', 'code' => 401]);

        // Act
        $response = $this->controller->changePassword($request);
        echo $response->getContent();

        // Assert
        $this->assertEquals(401, $response->getStatusCode());
        $this->assertStringContainsString('Invalid request', $response->getContent());
    }
}
