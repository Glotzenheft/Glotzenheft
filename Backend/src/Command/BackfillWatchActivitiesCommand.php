<?php
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
