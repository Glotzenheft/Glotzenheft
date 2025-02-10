<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250210004943 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add many to one relation between episode and season. Change tmdb_season_id to season_id.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE episode ADD tmdb_episode_id INT NOT NULL, CHANGE tmdb_season_id season_id INT NOT NULL');
        $this->addSql('ALTER TABLE episode ADD CONSTRAINT FK_DDAA1CDA4EC001D1 FOREIGN KEY (season_id) REFERENCES season (id)');
        $this->addSql('CREATE INDEX IDX_DDAA1CDA4EC001D1 ON episode (season_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE episode DROP FOREIGN KEY FK_DDAA1CDA4EC001D1');
        $this->addSql('DROP INDEX IDX_DDAA1CDA4EC001D1 ON episode');
        $this->addSql('ALTER TABLE episode ADD tmdb_season_id INT NOT NULL, DROP season_id, DROP tmdb_episode_id');
    }
}
