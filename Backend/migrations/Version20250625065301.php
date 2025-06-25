<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250625065301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add index to tracklist_episode and tracklist table for better statistic performance.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_tracklist_user_finish ON tracklist (user_id, finish_date)');
        $this->addSql('CREATE INDEX idx_episode_watch_date ON tracklist_episode (watch_date)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_tracklist_user_finish ON tracklist');
        $this->addSql('DROP INDEX idx_episode_watch_date ON tracklist_episode');
    }
}
