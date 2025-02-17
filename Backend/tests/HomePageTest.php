<?php
namespace App\Tests\Controller\API\Authorization;

use Symfony\Component\Panther\PantherTestCase;

class HomePageTest extends PantherTestCase {
public function testHomePage(): void
    {
        // Erstellt virtuellen Browser
        $client = static::createPantherClient(
            ['external_base_uri' => 'http://localhost:4200'],
            [],
            ['browser' => PantherTestCase::CHROME]
        );
        $crawler = $client->request('GET', '/');
        
        // Überprüfen, ob der Titel "Glotzenheft" vorhanden ist
        $this->assertSelectorTextContains('h1', 'Glotzenheft');
    
    }
}