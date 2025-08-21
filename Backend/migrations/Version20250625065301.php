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
final class Version20250625065301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add index to tracklist_episode and tracklist table for better statistic performance.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_tracklist_user_finish ON tracklist (user_id, finish_date)');
        $this->addSql('CREATE INDEX idx_episode_watch_date ON tracklist_episode (watch_date)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_tracklist_user_finish ON tracklist');
        $this->addSql('DROP INDEX idx_episode_watch_date ON tracklist_episode');
    }
}
