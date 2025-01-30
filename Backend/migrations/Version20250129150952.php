<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250129150952 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE episode CHANGE poster_path still_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE media ADD poster_path VARCHAR(255) DEFAULT NULL, ADD backdrop_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE tracklist ADD start_date DATE DEFAULT NULL, ADD finish_date DATE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist DROP start_date, DROP finish_date');
        $this->addSql('ALTER TABLE episode CHANGE still_path poster_path VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE media DROP poster_path, DROP backdrop_path');
    }
}
