<?php
namespace App\Tests\Controller\API\Authorization;

use Symfony\Component\Panther\PantherTestCase;

class LoginTest extends PantherTestCase {
    public function testUserLogin(): void {
        // Erstellt virtuellen Browser
        $client = static::createPantherClient(
            ['external_base_uri' => 'http://localhost:4200'],
            [],
            ['browser' => PantherTestCase::CHROME]
        );
        $crawler = $client->request('GET', '/login');

        $this->assertStringContainsString('/login', $client->getCurrentURL());
        
        $client->executeScript('
        document.getElementById("username").value = "Auto2Test";
        document.getElementById("password").value = "12345678";
        ');
        
        // Klicke auf den "Einloggen"-Button mit JavaScript
        $client->executeScript('document.querySelector("button[type=\'submit\']").click();');
        
        //$this->assertStringContainsString('/user', $client->getCurrentURL());
    }
}