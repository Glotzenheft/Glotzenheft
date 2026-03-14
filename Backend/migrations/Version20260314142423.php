<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260314142423 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add ON DELETE CASCADE to the relationship between TracklistSeason and Season to ensure data integrity when a global season record is removed.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7544EC001D1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7544EC001D1 FOREIGN KEY (season_id) REFERENCES season (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7544EC001D1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7544EC001D1 FOREIGN KEY (season_id) REFERENCES season (id)');
    }
}
