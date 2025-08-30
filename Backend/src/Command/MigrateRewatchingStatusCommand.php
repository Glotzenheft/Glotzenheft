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

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'glotzenheft:migrate:rewatching_status',
    description: 'Migrates tracklists with "rewatching" status to the new isRewatching flag.',
)]
class MigrateRewatchingStatusCommand extends Command
{
    public function __construct
    (
        private readonly EntityManagerInterface $entityManager
    )
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Start Migration of Rewatching Tracklists');

        $connection = $this->entityManager->getConnection();

        $oldStatus = 'rewatching';
        $newStatusWatching = 'watching';
        $newStatusCompleted = 'completed';

        $updatedCount = 0;

        try
        {
            $sqlWatching = <<<SQL
UPDATE tracklist
SET is_rewatching = :isRewatching, status = :newStatus
WHERE status = :oldStatus
  AND start_date IS NOT NULL
  AND finish_date IS NULL
SQL;

            $paramsWatching = [
                'isRewatching' => true,
                'newStatus' => $newStatusWatching,
                'oldStatus' => $oldStatus,
            ];

            $resultWatching = $connection->executeStatement($sqlWatching, $paramsWatching);
            $updatedCount += $resultWatching;
            $io->info(sprintf('Updated %d tracklist(s) to status "watching".', $resultWatching));

            $sqlCompleted = <<<SQL
UPDATE tracklist
SET is_rewatching = :isRewatching, status = :newStatus
WHERE status = :oldStatus
SQL;
            $paramsCompleted = [
                'isRewatching' => true,
                'newStatus' => $newStatusCompleted,
                'oldStatus' => $oldStatus,
            ];
            $resultCompleted = $connection->executeStatement($sqlCompleted, $paramsCompleted);
            $updatedCount += $resultCompleted;
            $io->info(sprintf('Updated %d tracklist(s) to status "completed".', $resultCompleted));

        }
        catch (Exception $e)
        {
            $io->error('An error occurred during migration: ' . $e->getMessage());
            return Command::FAILURE;
        }

        if ($updatedCount === 0)
        {
            $io->success('No tracklists with status "rewatching" found. Nothing to do.');
        }
        else
        {
            $io->success(sprintf('Successfully migrated a total of %d tracklist(s).', $updatedCount));
        }

        return Command::SUCCESS;
    }
}
