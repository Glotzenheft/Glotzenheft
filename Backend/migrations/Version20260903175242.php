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
final class Version20260903175242 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add extended TMDB properties (popularity, votes, external IDs, etc.) to Media, Season, and Episode entities.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE episode ADD vote_average DOUBLE PRECISION DEFAULT \'0\' NOT NULL, ADD vote_count INT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE media ADD adult TINYINT(1) DEFAULT 0 NOT NULL, ADD number_of_episodes INT DEFAULT NULL, ADD number_of_seasons INT DEFAULT NULL, ADD original_language VARCHAR(10) DEFAULT \'\' NOT NULL, ADD popularity DOUBLE PRECISION DEFAULT \'0\' NOT NULL, ADD status VARCHAR(255) DEFAULT NULL, ADD vote_average DOUBLE PRECISION DEFAULT \'0\' NOT NULL, ADD vote_count INT DEFAULT 0 NOT NULL, ADD homepage VARCHAR(2048) DEFAULT NULL, ADD tvdb_id INT DEFAULT NULL, ADD wikidata_id VARCHAR(255) DEFAULT NULL, ADD facebook_id VARCHAR(255) DEFAULT NULL, ADD instagram_id VARCHAR(255) DEFAULT NULL, ADD twitter_id VARCHAR(255) DEFAULT NULL, ADD tagline VARCHAR(255) DEFAULT NULL, ADD budget BIGINT DEFAULT 0 NOT NULL, ADD revenue BIGINT DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE season ADD vote_average DOUBLE PRECISION DEFAULT \'0\' NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE season DROP vote_average');
        $this->addSql('ALTER TABLE episode DROP vote_average, DROP vote_count');
        $this->addSql('ALTER TABLE media DROP adult, DROP number_of_episodes, DROP number_of_seasons, DROP original_language, DROP popularity, DROP status, DROP vote_average, DROP vote_count, DROP homepage, DROP tvdb_id, DROP wikidata_id, DROP facebook_id, DROP instagram_id, DROP twitter_id, DROP tagline, DROP budget, DROP revenue');
    }
}
