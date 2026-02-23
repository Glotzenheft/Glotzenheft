<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260223112946 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds user relation and timestamps to tracklist_tag table.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_tag ADD user_id INT NOT NULL, ADD created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE tracklist_tag ADD CONSTRAINT FK_BFDC52CEA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_BFDC52CEA76ED395 ON tracklist_tag (user_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_tag DROP FOREIGN KEY FK_BFDC52CEA76ED395');
        $this->addSql('DROP INDEX IDX_BFDC52CEA76ED395 ON tracklist_tag');
        $this->addSql('ALTER TABLE tracklist_tag DROP user_id, DROP created_at, DROP updated_at');
    }
}
