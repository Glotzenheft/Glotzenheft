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
final class Version20250901133325 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $sql = <<<'SQL'
CREATE TABLE backup (
    id INT AUTO_INCREMENT NOT NULL, 
    user_id INT NOT NULL, 
    type VARCHAR(255) NOT NULL, 
    status VARCHAR(255) NOT NULL, 
    filename VARCHAR(255) DEFAULT NULL, 
    tracklist_count INT DEFAULT NULL, 
    content_hash VARCHAR(255) DEFAULT NULL, 
    completed_at DATETIME DEFAULT NULL, 
    created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)', 
    updated_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)', 
    INDEX IDX_3FF0D1ACA76ED395 (user_id), 
    PRIMARY KEY(id)
) 
DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
SQL;

        $this->addSql($sql);
        $this->addSql('ALTER TABLE backup ADD CONSTRAINT FK_3FF0D1ACA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE tracklist ADD backup_hash VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE tracklist_episode ADD backup_hash VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE tracklist_season ADD backup_hash VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE backup DROP FOREIGN KEY FK_3FF0D1ACA76ED395');
        $this->addSql('DROP TABLE backup');
        $this->addSql('ALTER TABLE tracklist_season DROP backup_hash');
        $this->addSql('ALTER TABLE tracklist DROP backup_hash');
        $this->addSql('ALTER TABLE tracklist_episode DROP backup_hash');
    }
}
