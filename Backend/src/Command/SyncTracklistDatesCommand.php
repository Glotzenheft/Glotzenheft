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

        $tracklists = $this->tracklistRepository->findAllSeriesTracklistsByUserWithSeasonAndEpisodes($user);
        if (empty($tracklists))
        {
            $io->warning("Keine Tracklisten gefunden.");
            return Command::SUCCESS;
        }

        $this->stopwatch->start('sync_tracklist_dates');
        $updatedCounter = 0;
        $notUpdatedCounter = 0;
        $startDateUpdatedCounter = 0;
        $finishDateUpdatedCounter = 0;
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
                $io->info("Tracklist " . $tracklist->getTracklistName() . " übersprungen (keine Season).");
                $notUpdatedCounter++;
                continue;
            }

            $tracklistEpisodes = $tracklistSeason->getTracklistEpisodes();
            if ($tracklistEpisodes->isEmpty())
            {
                $io->info("Tracklist " . $tracklist->getTracklistName() . " übersprungen (keine Episoden).");
                $notUpdatedCounter++;
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
                $startDateUpdatedCounter++;
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
                    $finishDateUpdatedCounter++;
                }
            }

            if ($changed)
            {
                $updatedCounter++;
            }
            else
            {
                $notUpdatedCounter++;
            }
        }

        $this->entityManager->flush();
        $this->stopwatch->stop('sync_tracklist_dates');
        $dbTime = $this->stopwatch->getEvent('sync_tracklist_dates')->getDuration();

        $this->stopwatch->stop('command');
        $commandTime = $this->stopwatch->getEvent('command')->getDuration();
        $io->info("Dauer: $commandTime ms, DB: $dbTime ms");
        $io->info("Es wurden $notUpdatedCounter Tracklisten nicht aktualisiert.");
        $io->info("Es wurde $startDateUpdatedCounter mal das Startdatum aktualisiert.");
        $io->info("Es wurde $finishDateUpdatedCounter mal das Enddatum aktualisiert.");
        $io->success("Fertig! Es wurden $updatedCounter Tracklisten für User $userId synchronisiert.");

        return Command::SUCCESS;
    }
}
