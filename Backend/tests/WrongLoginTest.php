<?php

namespace App\Tests\Controller\API\Authorization;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

class WrongLoginTest extends WebTestCase
{
    public function testLoginWithInvalidCredentials(): void
    {
        $client = static::createClient();

        $invalidLoginData = [
            'username' => 'AutoTester',
            'password' => 'pwwwwwwwwwww!',
        ];
        
        // Failed Login Request
        $client->request('POST', '/api/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($invalidLoginData));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED, 'Invalid credentials should not allow login');
        echo "User login failed due to invalid credentials.\n";
    }
}