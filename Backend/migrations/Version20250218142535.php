<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250218142535 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Change relation to many (tracklist_episode) to one (episode).';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_episode DROP INDEX UNIQ_1EE6D8C7362B62A0, ADD INDEX IDX_1EE6D8C7362B62A0 (episode_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_episode DROP INDEX IDX_1EE6D8C7362B62A0, ADD UNIQUE INDEX UNIQ_1EE6D8C7362B62A0 (episode_id)');
    }
}
