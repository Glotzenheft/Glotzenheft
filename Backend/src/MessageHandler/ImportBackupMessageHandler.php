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

namespace App\MessageHandler;

use App\Enum\BackupStatus;
use App\Message\ImportBackupMessage;
use App\Repository\BackupRepository;
use App\Service\Backup\ImportService;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class ImportBackupMessageHandler
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ImportService          $importService,
        private readonly BackupRepository       $backupRepository,
        private readonly LoggerInterface        $logger,
        private readonly string                 $backupDirectory
    ) {
    }

    public function __invoke(ImportBackupMessage $message): void
    {
        $backup = $this->backupRepository->find($message->getBackupId());

        if (null === $backup)
        {
            $this->logger->error('Backup entity not found for import.', ['backupId' => $message->getBackupId()]);
            return;
        }

        $backup->setStatus(BackupStatus::PROCESSING);
        $this->entityManager->flush();

        try
        {
            $filepath = $this->backupDirectory . '/' . $backup->getFilename();
            if (!file_exists($filepath))
            {
                throw new RuntimeException('Backup file not found: ' . $filepath);
            }

            $jsonContent = file_get_contents($filepath);
            $data = json_decode($jsonContent, true);

            if (json_last_error() !== JSON_ERROR_NONE)
            {
                throw new RuntimeException('Failed to decode backup JSON: ' . json_last_error_msg());
            }

            $user = $backup->getUser();
            if (null === $user)
            {
                throw new RuntimeException('User not found for backup entity.');
            }

            $stats = $this->importService->processImport($data, $user);

            $backup->setStatus(BackupStatus::COMPLETED);
            $backup->setCompletedAt(new DateTime());
            // Maybe store stats somewhere in the future, for now just log them.
            $this->logger->info('Backup import completed.', ['stats' => $stats]);

        }
        catch (Exception $e)
        {
            $this->logger->error('Backup import failed.', ['exception' => $e]);
            $backup->setStatus(BackupStatus::FAILED);
        }

        $this->entityManager->flush();
    }
}
