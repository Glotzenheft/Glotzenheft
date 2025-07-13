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

declare(strict_types=1);

namespace App\Tests\Integration\AuthorizationController;

use App\Entity\User;
use App\Enum\SecurityQuestions;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class RegistrationTest extends WebTestCase
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    private string $username = 'testDeleteUser';
    private string $password = 'testDeletePassword123!';

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        // delete user if already exists
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->username]);
        if ($user instanceof User)
        {
            $this->entityManager->remove($user);
            $this->entityManager->flush();
        }
        // Create test user object
        $this->user = new User();
        $this->user->setUsername($this->username);
        $this->user->setPassword($this->password);
        $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
        $this->user->setSecurityAnswer('Grey');
    }

    public function testRegistration(): void
    {
        // Arrange
        $userData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->user->getSecurityAnswer(),
            'terms_accepted' => true
        ];

        // Act
        $this->client->request('POST', '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($userData));
        $registerResponse = json_decode($this->client->getResponse()->getContent(), true);

        // Assert
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED, 'User registration failed');
        $this->assertResponseIsSuccessful();

        echo PHP_EOL . 'User registration successful.' . PHP_EOL;
    }

    public function tearDown(): void
    {
        if ($this->user instanceof User)
        {
            $managedUser = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->username]);
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
