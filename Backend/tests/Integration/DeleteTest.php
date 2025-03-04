<?php declare(strict_types=1);

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Enum\SecurityQuestions;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class DeleteTest extends WebTestCase
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private $client;
    private String $token;

    private string $securityAnswer;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $passwordHasher = static::getContainer()->get(UserPasswordHasherInterface::class);

        // Create test user object
        $username = 'testuser';
        $this->securityAnswer = 'Grey';
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['username' => $username]);

        if (!$user instanceof User)
        {
            $this->user = new User();
            $this->user->setUsername($username);
            $hashedPassword = $passwordHasher->hashPassword($this->user, '123456677!');
            $this->user->setPassword($hashedPassword);
            $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
            $hashedSecurityAnswer = $passwordHasher->hashPassword($this->user, $this->securityAnswer);
            $this->user->setSecurityAnswer($hashedSecurityAnswer);
            $this->entityManager->persist($this->user);
            $this->entityManager->flush();
        }
        else
        {
            $this->user = $user;
        }
    }
    public function testUserDelete(): void
    {
        // Log in to get JWT token
        $loginData = [
            'username' => $this->user->getUsername(),
            'password' => '123456677!',
        ];
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->token = $responseData['token'] ?? '';

        $deleteData = [
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->securityAnswer,
        ];

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

        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User deletion failed');
        $deleteResponse = json_decode($this->client->getResponse()->getContent(), true);
        // Antwort kommt mit zwei Anführungszeichen
        if (!is_array($deleteResponse))
        {
            $deleteResponse = ['message' => trim($this->client->getResponse()->getContent(), '"')];
        }
        echo PHP_EOL;
        $this->assertEquals('User deleted successfully', $deleteResponse['message'] ?? '', 'Unexpected deletion message');
        echo "User deletion successful.\n";
    }
}