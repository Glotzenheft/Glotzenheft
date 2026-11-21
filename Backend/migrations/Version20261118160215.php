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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261118160215 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE watch_activity (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, media_id INT NOT NULL, episode_id INT DEFAULT NULL, tracklist_id INT NOT NULL, tracklist_episode_id INT DEFAULT NULL, watched_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', film_tracklist_id INT GENERATED ALWAYS AS (
                CASE WHEN episode_id IS NULL AND tracklist_episode_id IS NULL
                     THEN tracklist_id END
            ) VIRTUAL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_C58B353BA76ED395 (user_id), INDEX IDX_C58B353BEA9FDD75 (media_id), INDEX IDX_C58B353B362B62A0 (episode_id), INDEX IDX_C58B353B8C5F30E1 (tracklist_id), UNIQUE INDEX UNIQ_C58B353BF2294DB1 (tracklist_episode_id), INDEX idx_watch_activity_user_watched (user_id, watched_at, id), INDEX idx_watch_activity_user_media_watched (user_id, media_id, watched_at, id), UNIQUE INDEX uniq_watch_activity_film_tracklist (film_tracklist_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE watch_activity ADD CONSTRAINT FK_C58B353BA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE watch_activity ADD CONSTRAINT FK_C58B353BEA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE watch_activity ADD CONSTRAINT FK_C58B353B362B62A0 FOREIGN KEY (episode_id) REFERENCES episode (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE watch_activity ADD CONSTRAINT FK_C58B353B8C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE watch_activity ADD CONSTRAINT FK_C58B353BF2294DB1 FOREIGN KEY (tracklist_episode_id) REFERENCES tracklist_episode (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist ADD watch_visibility VARCHAR(255) DEFAULT \'public\' NOT NULL');
        $this->addSql('ALTER TABLE tracklist_episode ADD watch_visibility_override VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE watch_activity DROP FOREIGN KEY FK_C58B353BA76ED395');
        $this->addSql('ALTER TABLE watch_activity DROP FOREIGN KEY FK_C58B353BEA9FDD75');
        $this->addSql('ALTER TABLE watch_activity DROP FOREIGN KEY FK_C58B353B362B62A0');
        $this->addSql('ALTER TABLE watch_activity DROP FOREIGN KEY FK_C58B353B8C5F30E1');
        $this->addSql('ALTER TABLE watch_activity DROP FOREIGN KEY FK_C58B353BF2294DB1');
        $this->addSql('DROP TABLE watch_activity');
        $this->addSql('ALTER TABLE tracklist DROP watch_visibility');
        $this->addSql('ALTER TABLE tracklist_episode DROP watch_visibility_override');
    }
}
