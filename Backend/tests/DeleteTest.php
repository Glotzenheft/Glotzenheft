<?php
namespace App\Tests\Controller\API\User;
namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Enum\SecurityQuestions;

class DeleteTest extends WebTestCase
{
    private User $user;
    private EntityManagerInterface $entityManager;
    private $client;
    private String $token;

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->entityManager = static::getContainer()->get(EntityManagerInterface::class);

        // Create test user object
        $this->user = new User();
        $this->user->setUsername('testuser5');
        $this->user->setPassword('123456767!'); //123456677
        $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
        $this->user->setSecurityAnswer('Grey');
    }
    public function testUserDelete(): void
    {
        // Log in to get JWT token
        $loginData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
        ];
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->token = $responseData['token'] ?? '';

        $deleteData = [
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->user->getSecurityAnswer(),
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
        if (!is_array($deleteResponse)) {
            $deleteResponse = ['message' => trim($this->client->getResponse()->getContent(), '"')];
        }
        $this->assertEquals('User deleted successfully', $deleteResponse['message'] ?? '', 'Unexpected deletion message');
        echo "User deletion successful.\n";
    }
}