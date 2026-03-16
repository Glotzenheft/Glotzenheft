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
final class Version20260314140430 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update Tracklist and TracklistSeason: Convert dates to immutable, change relationship to OneToOne, and add custom tracking fields (language, subtitles, poster path, and anime-specific episode/part offsets).';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist ADD comment LONGTEXT DEFAULT NULL, ADD custom_air_date DATE DEFAULT NULL COMMENT \'(DC2Type:date_immutable)\', ADD language VARCHAR(2) DEFAULT NULL, ADD subtitle VARCHAR(2) DEFAULT NULL, ADD custom_poster_path VARCHAR(255) DEFAULT NULL, CHANGE start_date start_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', CHANGE finish_date finish_date DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE tracklist_season DROP INDEX IDX_B0AEE7548C5F30E1, ADD UNIQUE INDEX UNIQ_B0AEE7548C5F30E1 (tracklist_id)');
        $this->addSql('ALTER TABLE tracklist_season ADD start_episode_number INT DEFAULT NULL, ADD end_episode_number INT DEFAULT NULL, ADD custom_season_number INT DEFAULT NULL, ADD custom_part_number INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP INDEX UNIQ_B0AEE7548C5F30E1, ADD INDEX IDX_B0AEE7548C5F30E1 (tracklist_id)');
        $this->addSql('ALTER TABLE tracklist_season DROP start_episode_number, DROP end_episode_number, DROP custom_season_number, DROP custom_part_number');
        $this->addSql('ALTER TABLE tracklist DROP comment, DROP custom_air_date, DROP language, DROP subtitle, DROP custom_poster_path, CHANGE start_date start_date DATE DEFAULT NULL, CHANGE finish_date finish_date DATE DEFAULT NULL');
    }
}
