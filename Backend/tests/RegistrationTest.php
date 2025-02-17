<?php
namespace App\Tests\Controller\API\Authorization;

use Symfony\Component\Panther\PantherTestCase;
use Facebook\WebDriver\WebDriverBy;

class RegistrationTest extends PantherTestCase 
{
    public function testUserRegistration(): void 
    {
        // Erstellt virtuellen Browser
        $client = static::createPantherClient(
            ['external_base_uri' => 'http://localhost:4200'],
            [],
            ['browser' => PantherTestCase::CHROME]
        );
        
        // Request an die Seite /register
        $crawler = $client->request('GET', '/register');
        
        // Warten auf das Formular
        $client->waitFor('form');
        
        // Überprüfen, ob die Formularfelder existieren
        $this->assertSelectorExists('[name="username"]');
        $this->assertSelectorExists('[name="password"]');
        $this->assertSelectorExists('[name="passwordConfirm"]');
        $this->assertSelectorExists('[name="answer"]');
        
        // Warten auf Dropdown "validationQuestion", falls benötigt
        //$client->waitForVisibility('[formcontrolname="validationQuestion"]', 10);
        
        // Dropdown-Menü "validationQuestion" öffnen, falls es im Formular existiert
        $client->executeScript("document.querySelector('[formcontrolname=\"validationQuestion\"]').scrollIntoView(true);");
        $dropdown = $client->findElement(WebDriverBy::cssSelector('[formcontrolname="validationQuestion"]'));
        $dropdown->click();
        
        // Warten auf das Öffnen des Dropdowns und Auswahl eines Werts
        $client->waitFor('[role="option"]', 1);  
        
        // Wähle den ersten verfügbaren Wert im Dropdown
        $client->executeScript("document.querySelector('[role=\"option\"]').click()");
        
        // Das Formular ausfüllen
        $form = $crawler->selectButton('Registrieren')->form([
            'username' => 'AutoTester',  // username
            'password' => '12345678',  // Passwort
            'passwordConfirm' => '12345678',  // Passwortbestätigung
            'answer' => 'One Piece',  // Antwort auf Sicherheitsfrage
        ]);
        
        // Formular absenden
        $client->submit($form);

        // Warte auf eine Weiterleitung zur Login-Seite
        $client->waitFor('.login-page');  // Warten auf Login-Seite
        $this->assertResponseRedirects('/login');  // Überprüfen, ob die Weiterleitung zur Login-Seite erfolgt
        
        // Debugging-Ausgabe, um zu sehen, ob das Formular korrekt gesendet wurde
        $responseContent = $client->getResponse()->getContent();
        $this->assertNotEmpty($responseContent, 'Antwortinhalt ist leer');
    }
}
