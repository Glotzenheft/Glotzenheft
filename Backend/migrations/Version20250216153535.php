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
final class Version20250216153535 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add n:1 relation from Tracklist Season to Season.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season ADD season_id INT NOT NULL');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7544EC001D1 FOREIGN KEY (season_id) REFERENCES season (id)');
        $this->addSql('CREATE INDEX IDX_B0AEE7544EC001D1 ON tracklist_season (season_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7544EC001D1');
        $this->addSql('DROP INDEX IDX_B0AEE7544EC001D1 ON tracklist_season');
        $this->addSql('ALTER TABLE tracklist_season DROP season_id');
    }
}
