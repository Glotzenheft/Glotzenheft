<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class LoginTest extends WebTestCase
{
    public function testLogin(): void
    {
        $client = static::createClient();

        // Login Request
        $loginData = [
            'username' => 'AutoTester2',
            'password' => '12345678!',
        ];
        
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($loginData));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK, 'User login failed');
        $loginResponse = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('token', $loginResponse, 'No token received after login');
        echo "User login successful.\n";
    }
}
