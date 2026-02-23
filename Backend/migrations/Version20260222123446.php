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
final class Version20260222123446 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creates tracklist_tag table and many-to-many relationship with tracklists.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tracklist_tracklist_tag (tracklist_id INT NOT NULL, tracklist_tag_id INT NOT NULL, INDEX IDX_5E2AC20C8C5F30E1 (tracklist_id), INDEX IDX_5E2AC20CFA98DFEC (tracklist_tag_id), PRIMARY KEY(tracklist_id, tracklist_tag_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tracklist_tag (id INT AUTO_INCREMENT NOT NULL, tracklist_tag_type VARCHAR(255) NOT NULL, tag_name VARCHAR(255) NOT NULL, color VARCHAR(7) DEFAULT NULL, description LONGTEXT DEFAULT NULL, icon VARCHAR(50) DEFAULT NULL, slug VARCHAR(255) DEFAULT NULL, is_spoiler TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE tracklist_tracklist_tag ADD CONSTRAINT FK_5E2AC20C8C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_tracklist_tag ADD CONSTRAINT FK_5E2AC20CFA98DFEC FOREIGN KEY (tracklist_tag_id) REFERENCES tracklist_tag (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_tracklist_tag DROP FOREIGN KEY FK_5E2AC20C8C5F30E1');
        $this->addSql('ALTER TABLE tracklist_tracklist_tag DROP FOREIGN KEY FK_5E2AC20CFA98DFEC');
        $this->addSql('DROP TABLE tracklist_tracklist_tag');
        $this->addSql('DROP TABLE tracklist_tag');
    }
}
