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

final class Version20261122000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Allow each episode only once per tracklist season.';
    }

    public function up(Schema $schema): void
    {
        $this->abortIf(
            (bool) $this->connection->fetchOne('SELECT 1 FROM tracklist_episode GROUP BY tracklist_season_id, episode_id HAVING COUNT(*) > 1 LIMIT 1'),
            'Resolve duplicate episodes per tracklist season before retrying this migration.',
        );
        $this->addSql('CREATE UNIQUE INDEX uniq_tracklist_season_episode ON tracklist_episode (tracklist_season_id, episode_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX uniq_tracklist_season_episode ON tracklist_episode');
    }
}
