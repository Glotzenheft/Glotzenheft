<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class RegistrationTest extends WebTestCase
{
    public function testRegistration(): void
    {
        $client = static::createClient();
        $entityManager = static::getContainer()->get(EntityManagerInterface::class);        

        $userData = [
            'username' => 'AutoTester4',
            'password' => '12345678!',
            'security_question' => 'Welche Serie haben Sie zuerst geschaut?',
            'security_answer' => 'One Piece',
        ];

        // Registration Request
        $client->request('POST', '/api/register', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($userData));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User registration failed');
        $registerResponse = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $registerResponse, 'No token received after registration');
        echo "User registration successful.\n";

        // Cleanup: Delete test user
        $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $userData['username']]);
        if ($user) {
            $entityManager->remove($user);
            $entityManager->flush();
            echo "Test user deleted.\n";
        }
    }
}
