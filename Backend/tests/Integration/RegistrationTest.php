<?php declare(strict_types=1);

namespace App\Tests\Integration;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use App\Enum\SecurityQuestions;

class RegistrationTest extends WebTestCase
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
        $this->user->setUsername('testuser10');
        $this->user->setPassword('123456677!');
        $this->user->setSecurityQuestion(SecurityQuestions::PET_COLOR);
        $this->user->setSecurityAnswer('Grey');
    }
    public function testRegistration(): void
    {
         
        $userData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->user->getSecurityAnswer(),
        ];

        // Registration Request
        $this->client->request('POST', '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($userData));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User registration failed');
        $registerResponse = json_decode($this->client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $registerResponse, 'No token received after registration');
        echo "User registration successful.\n";
     }
     public function changePassword(): void 
     {
        // Log in to get JWT token
        $loginData = [
            'username' => $this->user->getUsername(),
            'password' => $this->user->getPassword(),
        ];
        $this->client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $responseData = json_decode($this->client->getResponse()->getContent(), true);
        $this->token = $responseData['token'] ?? '';
        $changePasswordData = [
            'security_question' => $this->user->getSecurityQuestion(),
            'security_answer' => $this->user->getSecurityAnswer(),
            'new_password' => '123456767!',
        ];
        
        $this->client->request(
            'POST',
            '/api/user',
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Authorization' => 'Bearer ' . $this->token,
            ],
            json_encode($changePasswordData)
        );
        
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'Password change failed');
        $changePasswordResponse = json_decode($this->client->getResponse()->getContent(), true);
        // Antwort kommt mit zwei Anführungszeichen
        if (!is_array($changePasswordResponse)) {
            $changePasswordResponse = ['message' => trim($this->client->getResponse()->getContent(), '"')];
        }
        $this->assertEquals('Password successfully changed', $changePasswordResponse['message'] ?? '', 'Unexpected password change message');
        echo "User password changed successfully.\n";
     }
     public function deleteUserTest(): void 
     {
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
