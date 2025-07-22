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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250129232224 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE media_tmdbgenre (media_id INT NOT NULL, tmdbgenre_id INT NOT NULL, INDEX IDX_5A7F82D1EA9FDD75 (media_id), INDEX IDX_5A7F82D14AF4A685 (tmdbgenre_id), PRIMARY KEY(media_id, tmdbgenre_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE media_tmdbgenre ADD CONSTRAINT FK_5A7F82D1EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE media_tmdbgenre ADD CONSTRAINT FK_5A7F82D14AF4A685 FOREIGN KEY (tmdbgenre_id) REFERENCES tmdbgenre (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tmdbgenre_media DROP FOREIGN KEY FK_D65A0E20EA9FDD75');
        $this->addSql('ALTER TABLE tmdbgenre_media DROP FOREIGN KEY FK_D65A0E204AF4A685');
        $this->addSql('DROP TABLE tmdbgenre_media');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE tmdbgenre_media (tmdbgenre_id INT NOT NULL, media_id INT NOT NULL, INDEX IDX_D65A0E204AF4A685 (tmdbgenre_id), INDEX IDX_D65A0E20EA9FDD75 (media_id), PRIMARY KEY(tmdbgenre_id, media_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE tmdbgenre_media ADD CONSTRAINT FK_D65A0E20EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tmdbgenre_media ADD CONSTRAINT FK_D65A0E204AF4A685 FOREIGN KEY (tmdbgenre_id) REFERENCES tmdbgenre (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE media_tmdbgenre DROP FOREIGN KEY FK_5A7F82D1EA9FDD75');
        $this->addSql('ALTER TABLE media_tmdbgenre DROP FOREIGN KEY FK_5A7F82D14AF4A685');
        $this->addSql('DROP TABLE media_tmdbgenre');
    }
}
