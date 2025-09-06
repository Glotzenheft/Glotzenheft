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

namespace App\MessageHandler\Backup;

use App\Entity\Backup;
use App\Entity\User;
use App\Enum\BackupStatus;
use App\Message\Backup\ImportBackupMessage;
use App\Repository\BackupRepository;
use App\Service\Backup\ImportBackupService;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
readonly class ImportBackupMessageHandler
{
    public function __construct(
        #[Autowire('%env(resolve:BACKUP_DIR)%')]
        private string                 $backupDirectory,
        private EntityManagerInterface $entityManager,
        private ImportBackupService    $importService,
        private BackupRepository       $backupRepository,
        private LoggerInterface        $logger,
    ){}

    public function __invoke(ImportBackupMessage $message): void
    {
        $backup = $this->backupRepository->find($message->getBackupId());
        if (!$backup instanceof Backup)
        {
            $this->logger->error(
                message: 'Backup entity not found for import.',
                context: [
                    'backupId' => $message->getBackupId()
                ]
            );
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
            if (!$user instanceof User)
            {
                throw new RuntimeException('User not found for backup entity.');
            }

            if ($this->importService->processImport($data, $user))
            {
                $now = new DateTimeImmutable(
                    datetime: 'now',
                    timezone: new DateTimeZone('Europe/Berlin')
                );
                $this->logger->info(message: 'Backup imported complete time:  ' . $now->format('Y-m-d H:i:s'));
                $backup
                    ->setStatus(BackupStatus::COMPLETED)
                    ->setCompletedAt($now);
            }
            else
            {
                $backup->setStatus(BackupStatus::FAILED);
            }
        }
        catch (Exception $exception)
        {
            $this->logger->error(
                message: 'Backup import failed.',
                context: [
                    'exception' => $exception
                ]
            );
            $backup->setStatus(BackupStatus::FAILED);
        }

        $this->entityManager->flush();
    }
}