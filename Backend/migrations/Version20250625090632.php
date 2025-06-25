<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250625090632 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add index to tracklist for better user rating performance.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_tracklist_user_rating ON tracklist (user_id, rating)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_tracklist_user_rating ON tracklist');
    }
}
