<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Tracklist;
use App\Entity\TracklistEpisode;
use App\Entity\TracklistSeason;
use App\Entity\User;
use App\Repository\TracklistRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Stopwatch\Stopwatch;

#[AsCommand(
    name: 'glotzenheft:sync:tracklist_dates',
    description: 'Synchronized start and end dates of tracklists based on the episodes watched.',
)]
class SyncTracklistDatesCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly TracklistRepository $tracklistRepository,
        private readonly Stopwatch $stopwatch,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument('userId', InputArgument::REQUIRED, 'Id of the user whose tracklists should be syncronized.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->stopwatch->start('command');
        $io = new SymfonyStyle($input, $output);
        $userId = (int) $input->getArgument('userId');

        $io->info("Lade Tracklisten für User ID $userId...");

        $user = $this->entityManager->getRepository(User::class)->find($userId);

        $tracklists = $this->tracklistRepository->findAllTracklistsByUserWithSeasonAndEpisodes($user);
        if (empty($tracklists))
        {
            $io->warning("Keine Tracklisten gefunden.");
            return Command::SUCCESS;
        }

        $this->stopwatch->start('sync_tracklist_dates');
        $updatedCounter = 0;
        $tracklistCounter = count($tracklists);
        $io->info("Es wurden $tracklistCounter Tracklisten gefunden.");
        /**
         * @var Tracklist $tracklist
         */
        foreach ($tracklists as $tracklist)
        {
            $tracklistSeason = $tracklist->getTracklistSeason();
            if (!$tracklistSeason instanceof TracklistSeason)
            {
                $io->info("Film " . $tracklist->getTracklistName() . " übersprungen.");
                continue;
            }

            $tracklistEpisodes = $tracklistSeason->getTracklistEpisodes();
            if ($tracklistEpisodes->isEmpty())
            {
                continue;
            }

            $watchTimestamps = [];
            foreach ($tracklistEpisodes as $tracklistEpisode)
            {
                if ($tracklistEpisode instanceof TracklistEpisode)
                {
                    $watchDate = $tracklistEpisode->getWatchDate();
                    if ($watchDate !== null)
                    {
                        $watchTimestamps[] = $watchDate->getTimestamp();
                    }
                }
            }

            if (empty($watchTimestamps))
            {
                continue;
            }

            $minTimestamp = min($watchTimestamps);
            $maxTimestamp = max($watchTimestamps);

            $calculatedStartDate = (new DateTimeImmutable())->setTimestamp($minTimestamp);
            $calculatedFinishDate = (new DateTimeImmutable())->setTimestamp($maxTimestamp);

            $status = $tracklist->getStatus()->value;
            $changed = false;

            $tracklistStartDate = $tracklist->getStartDate();
            $tracklistFinishDate = $tracklist->getFinishDate();

            // --- STARTDATE ---
            $updateStart = false;
            if ($tracklistStartDate === null)
            {
                $updateStart = true;
            }
            else
            {
                $isMidnight = $tracklistStartDate->format('H:i:s') === '00:00:00';
                $isSameDate = $tracklistStartDate->format('Y-m-d') === $calculatedStartDate->format('Y-m-d');

                if ($isSameDate
                    && $isMidnight
                    && $tracklistStartDate->getTimestamp() !== $calculatedStartDate->getTimestamp()
                )
                {
                    $updateStart = true;
                }
            }

            if ($updateStart)
            {
                $tracklist->setStartDate($calculatedStartDate);
                $changed = true;
            }

            // --- FINISHDATE ---
            if (in_array($status, ['completed', 'dropped'], true))
            {
                $updateFinish = false;
                if ($tracklistFinishDate === null)
                {
                    $updateFinish = true;
                }
                else
                {
                    $isMidnight = $tracklistFinishDate->format('H:i:s') === '00:00:00';
                    $isSameDate = $tracklistFinishDate->format('Y-m-d') === $calculatedFinishDate->format('Y-m-d');

                    if ($isSameDate && $isMidnight && $tracklistFinishDate->getTimestamp() !== $calculatedFinishDate->getTimestamp())
                    {
                        $updateFinish = true;
                    }
                }

                if ($updateFinish)
                {
                    $tracklist->setFinishDate($calculatedFinishDate);
                    $changed = true;
                }
            }

            if ($changed)
            {
                $updatedCounter++;
            }
        }

        $this->entityManager->flush();
        $this->stopwatch->stop('sync_tracklist_dates');
        $dbTime = $this->stopwatch->getEvent('sync_tracklist_dates')->getDuration();

        $this->stopwatch->stop('command');
        $commandTime = $this->stopwatch->getEvent('command')->getDuration();
        $io->info("Dauer: $commandTime ms, DB: $dbTime ms");
        $io->success("Fertig! Es wurden $updatedCounter Tracklisten für User $userId synchronisiert.");

        return Command::SUCCESS;
    }
}
