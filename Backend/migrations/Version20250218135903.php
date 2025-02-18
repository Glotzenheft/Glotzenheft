<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250218135903 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add ON DELETE CASCADE to tracklist season when deleting a tracklist and to tracklist episode when deleting a tracklist season.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C72DA5A828');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C72DA5A828 FOREIGN KEY (tracklist_season_id) REFERENCES tracklist_season (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7548C5F30E1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7548C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7548C5F30E1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7548C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id)');
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C72DA5A828');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C72DA5A828 FOREIGN KEY (tracklist_season_id) REFERENCES tracklist_season (id)');
    }
}
