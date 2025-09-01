<?php

declare(strict_types=1);

namespace App\MessageHandler\Backup;

use App\Entity\Backup;
use App\Entity\User;
use App\Enum\BackupStatus;
use App\Enum\BackupType;
use App\Message\Backup\CreateBackupMessage;
use App\Repository\BackupRepository;
use App\Repository\UserRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
readonly class CreateBackupMessageHandler
{

    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository         $userRepository,
        private BackupService          $backupService,
        private HashService            $hashService,
        private Filesystem             $filesystem,
        private LoggerInterface        $logger,
        #[Autowire('%env(resolve:BACKUP_DIR)%')]
        private string                 $backupDirectory
    ){}

    public function __invoke(CreateBackupMessage $message): void
    {
        $user = $this->userRepository->find($message->getUserId());
        if (!$user instanceof User)
        {
            $this->logger->error(
                'User not found for backup creation.',
                ['userId' => $message->getUserId()]
            );
            return;
        }

        $backup = (new Backup())
            ->setUser($user)
            ->setFilename('')
            ->setType(BackupType::EXPORT)
            ->setStatus(BackupStatus::PROCESSING);

        $this->entityManager->persist($backup);
        $this->entityManager->flush();

        try
        {
            $backupData = $this->backupService->generateBackupData($user);
            $jsonContent = json_encode($backupData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

            if (false === $jsonContent)
            {
                throw new RuntimeException('Failed to encode backup data to JSON.');
            }

            $contentHash = $this->hashService->generateForContent($jsonContent);
            $filename = sprintf('glotzenheft_backup_%s_%s.json', $user->getId(), date('YmdHis'));

            $this->filesystem->mkdir($this->backupDirectory);
            $this->filesystem->dumpFile($this->backupDirectory . '/' . $filename, $jsonContent);

            $backup->setStatus(BackupStatus::COMPLETED)
                ->setFilename($filename)
                ->setTracklistCount($backupData['count'])
                ->setContentHash($contentHash)
                ->setCompletedAt(new DateTime());

            $this->logger->info(message: 'Backup import completed.');
        }
        catch (Exception $e)
        {
            $this->logger->error(
                message: 'Backup creation failed.',
                context: [
                    'exception' => $e->getMessage()
                ]
            );
            $backup->setStatus(BackupStatus::FAILED);
        }

        $this->entityManager->flush();
    }
}