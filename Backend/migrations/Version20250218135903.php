<?php
/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250218135903 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add ON DELETE CASCADE to tracklist season when deleting a tracklist and to tracklist episode when deleting a tracklist season.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C72DA5A828');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C72DA5A828 FOREIGN KEY (tracklist_season_id) REFERENCES tracklist_season (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7548C5F30E1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7548C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE tracklist_season DROP FOREIGN KEY FK_B0AEE7548C5F30E1');
        $this->addSql('ALTER TABLE tracklist_season ADD CONSTRAINT FK_B0AEE7548C5F30E1 FOREIGN KEY (tracklist_id) REFERENCES tracklist (id)');
        $this->addSql('ALTER TABLE tracklist_episode DROP FOREIGN KEY FK_1EE6D8C72DA5A828');
        $this->addSql('ALTER TABLE tracklist_episode ADD CONSTRAINT FK_1EE6D8C72DA5A828 FOREIGN KEY (tracklist_season_id) REFERENCES tracklist_season (id)');
    }
}
