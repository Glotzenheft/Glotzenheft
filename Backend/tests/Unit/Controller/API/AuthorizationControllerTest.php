<?php

declare(strict_types=1);

namespace App\Tests\Unit\Controller\API;

use App\Controller\API\Authorization\AuthorizationController;
use App\Entity\User;
use App\Enum\SecurityQuestions;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthorizationControllerTest extends TestCase
{
    private AuthorizationController $controller;
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;
    private ContainerBagInterface $params;

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->passwordHasher = $this->createMock(UserPasswordHasherInterface::class);
        $this->params = $this->createMock(ContainerBagInterface::class);

        $this->params->method('get')->with('kernel.project_dir')->willReturn('/some/path');
        $this->controller = new AuthorizationController($this->params);
    }

    public function testRegisterMissingParameters(): void
    {
        // Arrange
        $request = new Request([], [], [], [], [], [], json_encode([]));

        // Act
        $response = $this->controller->register($request, $this->entityManager, $this->passwordHasher);
        echo $response->getContent();
        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertStringContainsString('Missing parameters.', $response->getContent());
    }

    public function testRegisterUserAlreadyExists(): void
    {
        // Arrange
        $requestData = [
            'username' => 'existingUser',
            'password' => 'password123',
            'security_question' => 'PET_COLOR',
            'security_answer' => 'Grey'
        ];
        $request = new Request([], [], [], [], [], [], json_encode($requestData));
        
        $userRepository = $this->createMock(EntityRepository::class);
        $userRepository->method('findOneBy')->willReturn(new User());
        
        $this->entityManager->method('getRepository')->willReturn($userRepository);

        // Act
        $response = $this->controller->register($request, $this->entityManager, $this->passwordHasher);

        // Assert
        $this->assertEquals(409, $response->getStatusCode());
        $this->assertStringContainsString('User already exists', $response->getContent());
    }

    public function testRegisterInvalidSecurityQuestion(): void
    {
        // Arrange
        $requestData = [
            'username' => 'newUser',
            'password' => 'password123',
            'security_question' => 'INVALID_QUESTION',
            'security_answer' => 'Grey'
        ];
        $request = new Request([], [], [], [], [], [], json_encode($requestData));
        
        $userRepository = $this->createMock(EntityRepository::class);
        $userRepository->method('findOneBy')->willReturn(null);
        
        $this->entityManager->method('getRepository')->willReturn($userRepository);

        // Act
        $response = $this->controller->register($request, $this->entityManager, $this->passwordHasher);
        echo $response->getContent();
        // Assert
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertStringContainsString('Invalid security question.', $response->getContent());
    }

    public function testRegisterSuccess(): void
    {
        // Arrange
        $requestData = [
            'username' => 'newUser',
            'password' => 'password123',
            'security_question' => SecurityQuestions::PET_COLOR,
            'security_answer' => 'Grey'
        ];
        $request = new Request([], [], [], [], [], [], json_encode($requestData));
        
        $userRepository = $this->createMock(EntityRepository::class);
        $userRepository->method('findOneBy')->willReturn(null);
        
        $this->entityManager->method('getRepository')->willReturn($userRepository);
        
        $this->passwordHasher->method('hashPassword')->willReturn('hashedPassword');

        // Act
        $response = $this->controller->register($request, $this->entityManager, $this->passwordHasher);

        // Assert
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertStringContainsString('User registered successfully', $response->getContent());
    }
}
