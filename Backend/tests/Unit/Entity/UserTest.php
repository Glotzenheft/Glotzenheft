<?php

namespace App\Tests\Entity;

use App\Entity\User;
use App\Enum\SecurityQuestions;
use PHPUnit\Framework\TestCase;
use Doctrine\Common\Collections\Collection;


class UserTest extends TestCase
{
    public function testUsername()
    {
        // Arrange
        $user = new User();
        $expectedUsername = 'testUser';

        // Act
        $user->setUsername($expectedUsername);

        // Assert
        $this->assertEquals($expectedUsername, $user->getUsername());
    }

    public function testRoles()
    {
        // Arrange
        $user = new User();
        $roles = ['ROLE_ADMIN'];

        // Act
        $user->setRoles($roles);

        // Assert
        $this->assertContains('ROLE_ADMIN', $user->getRoles());
        $this->assertContains('ROLE_USER', $user->getRoles()); // Standardrolle
    }

    public function testPassword()
    {
        // Arrange
        $user = new User();
        $expectedPassword = 'hashedPassword';

        // Act
        $user->setPassword($expectedPassword);

        // Assert
        $this->assertEquals($expectedPassword, $user->getPassword());
    }

    public function testSecurityQuestion()
    {
        // Arrange
        $user = new User();
        $expectedQuestion = SecurityQuestions::PET_COLOR;

        // Act
        $user->setSecurityQuestion($expectedQuestion);

        // Assert
        $this->assertEquals($expectedQuestion, $user->getSecurityQuestion());
    }

    public function testSecurityAnswer()
    {
        // Arrange
        $user = new User();
        $expectedAnswer = 'Dog';

        // Act
        $user->setSecurityAnswer($expectedAnswer);

        // Assert
        $this->assertEquals($expectedAnswer, $user->getSecurityAnswer());
    }

    public function testTracklistsInitialization()
    {
        // Arrange
        $user = new User();

        // Act & Assert
        $this->assertInstanceOf(Collection::class, $user->getTracklists());
        $this->assertCount(0, $user->getTracklists());
    }
}