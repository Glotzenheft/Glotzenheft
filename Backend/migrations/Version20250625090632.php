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
final class Version20250625090632 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add index to tracklist for better user rating performance.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE INDEX idx_tracklist_user_rating ON tracklist (user_id, rating)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX idx_tracklist_user_rating ON tracklist');
    }
}
