<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

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