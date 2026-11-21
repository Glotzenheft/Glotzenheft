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

use App\Service\WatchActivity\WatchActivitySynchronizer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Throwable;

#[AsCommand(
    name: 'glotzenheft:watch-activity:backfill',
    description: 'Synchronisiert Schauaktivitäten aus bestehenden Filmlisten und Episodeneinträgen.',
)]
final class BackfillWatchActivitiesCommand extends Command
{
    public function __construct(private readonly WatchActivitySynchronizer $synchronizer)
    {
        parent::__construct();
    }

    /**
     * @throws Throwable
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $processed = $this->synchronizer->backfill();
        $io->success(sprintf(
            '%d Filmtracklisten und %d Episodeneinträge geprüft und ihre Aktivitäten synchronisiert.',
            $processed['movies'],
            $processed['episodes'],
        ));

        return Command::SUCCESS;
    }
}
