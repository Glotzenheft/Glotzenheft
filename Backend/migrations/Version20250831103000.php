<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250831103000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add backup_hash to tracklist_season and tracklist_episode tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season ADD backup_hash VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE tracklist_episode ADD backup_hash VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP backup_hash');
        $this->addSql('ALTER TABLE tracklist_episode DROP backup_hash');
    }
}
