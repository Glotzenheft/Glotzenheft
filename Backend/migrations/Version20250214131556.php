<?php
/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250214131556 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Changed entity db structure. Added tracklist_season table.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tracklist_season (id INT AUTO_INCREMENT NOT NULL, tracklist_id INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B0AEE7548C5F30E1 (tracklist_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7548C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id)');
        $this->addSql('ALTER TABLE tracklist_user DROP FOREIGN KEY FK_8542BE818C5F30E1');
        $this->addSql('ALTER TABLE tracklist_user DROP FOREIGN KEY FK_8542BE81A76ED395');
        $this->addSql('ALTER TABLE tracklist_media DROP FOREIGN KEY FK_FF9B3AE6EA9FDD75');
        $this->addSql('ALTER TABLE tracklist_media DROP FOREIGN KEY FK_FF9B3AE68C5F30E1');
        $this->addSql('DROP TABLE tracklist_user');
        $this->addSql('DROP TABLE tracklist_media');
        $this->addSql('ALTER TABLE media CHANGE tmdb_id tmdb_id INT NOT NULL');
        $this->addSql('ALTER TABLE tracklist ADD media_id INT NOT NULL, ADD user_id INT NOT NULL');
        $this->addSql('ALTER TABLE tracklist ADD CONSTRAINT FK_8DFC4B67EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id)');
        $this->addSql('ALTER TABLE tracklist ADD CONSTRAINT FK_8DFC4B67A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('CREATE INDEX IDX_8DFC4B67EA9FDD75 ON tracklist (media_id)');
        $this->addSql('CREATE INDEX IDX_8DFC4B67A76ED395 ON tracklist (user_id)');
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C78C5F30E1');
        $this->addSql('DROP INDEX IDX_1EE6D8C78C5F30E1 ON tracklist_episode');
        $this->addSql('ALTER TABLE tracklist_episode CHANGE tracklist_id tracklist_season_id INT NOT NULL');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C72DA5A828 FOREIGN KEY (tracklist_season_id) REFERENCES tracklist_season (id)');
        $this->addSql('CREATE INDEX IDX_1EE6D8C72DA5A828 ON tracklist_episode (tracklist_season_id)');
        $this->addSql('ALTER TABLE user ADD security_question VARCHAR(255) NOT NULL, ADD security_answer VARCHAR(255) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C72DA5A828');
        $this->addSql('CREATE TABLE tracklist_user (tracklist_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_8542BE818C5F30E1 (tracklist_id), INDEX IDX_8542BE81A76ED395 (user_id), PRIMARY KEY(tracklist_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE tracklist_media (tracklist_id INT NOT NULL, media_id INT NOT NULL, INDEX IDX_FF9B3AE68C5F30E1 (tracklist_id), INDEX IDX_FF9B3AE6EA9FDD75 (media_id), PRIMARY KEY(tracklist_id, media_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE tracklist_user ADD CONSTRAINT FK_8542BE818C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_user ADD CONSTRAINT FK_8542BE81A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_media ADD CONSTRAINT FK_FF9B3AE6EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_media ADD CONSTRAINT FK_FF9B3AE68C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7548C5F30E1');
        $this->addSql('DROP TABLE tracklist_season');
        $this->addSql('ALTER TABLE tracklist DROP FOREIGN KEY FK_8DFC4B67EA9FDD75');
        $this->addSql('ALTER TABLE tracklist DROP FOREIGN KEY FK_8DFC4B67A76ED395');
        $this->addSql('DROP INDEX IDX_8DFC4B67EA9FDD75 ON tracklist');
        $this->addSql('DROP INDEX IDX_8DFC4B67A76ED395 ON tracklist');
        $this->addSql('ALTER TABLE tracklist DROP media_id, DROP user_id');
        $this->addSql('ALTER TABLE `user` DROP security_question, DROP security_answer');
        $this->addSql('DROP INDEX IDX_1EE6D8C72DA5A828 ON tracklist_episode');
        $this->addSql('ALTER TABLE tracklist_episode CHANGE tracklist_season_id tracklist_id INT NOT NULL');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C78C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id)');
        $this->addSql('CREATE INDEX IDX_1EE6D8C78C5F30E1 ON tracklist_episode (tracklist_id)');
        $this->addSql('ALTER TABLE media CHANGE tmdb_id tmdb_id INT DEFAULT NULL');
    }
}
