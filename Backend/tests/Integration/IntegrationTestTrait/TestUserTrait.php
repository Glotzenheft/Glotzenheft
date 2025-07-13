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

namespace App\Tests\Integration\IntegrationTestTrait;

use App\Entity\User;
use App\Enum\SecurityQuestions;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

trait TestUserTrait
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private KernelBrowser $client;

    private string $securityAnswer = 'Grey';
    private string $username = 'testuser';
    private string $password = 'p123456677!';

    private bool $termsAccepted = true;

    private ?string $token = null;

    public function setUpTestUserTrait(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        // Create test user object
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $this->username]);

        if (!$user instanceof User)
        {
            $this->user = new User();
            $this->user->setUsername($this->username);

            $hashedPassword = $passwordHasher->hashPassword($this->user, $this->password);
            $hashedSecurityAnswer = $passwordHasher->hashPassword($this->user, $this->securityAnswer);

            $this->user->setPassword($hashedPassword);
            $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
            $this->user->setSecurityAnswer($hashedSecurityAnswer);
            $this->user->setTermsAccepted($this->termsAccepted);
            $this->user->setTermsAcceptedAt(new DateTimeImmutable());

            $this->entityManager->persist($this->user);
            $this->entityManager->flush();
        }
        else
        {
            $this->user = $user;
        }
    }

    private function loginUser(): void
    {
        $loginData = [
            'username' => $this->username,
            'password' => $this->password,
        ];

        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->token = $responseData['token'] ?? null;
    }

    protected function getAuthHeaders(): array
    {
        if (!$this->token)
        {
            throw new RuntimeException('No authentication token available. Did the login fail?');
        }

        return [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_Authorization' => 'Bearer ' . $this->token,
        ];
    }
}