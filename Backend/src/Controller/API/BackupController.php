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

namespace App\Controller\API;

use App\Entity\Backup;
use App\Entity\User;
use App\Enum\BackupStatus;
use App\Enum\BackupType;
use App\Message\CreateBackupMessage;
use App\Message\ImportBackupMessage;
use App\Model\Request\Backup\ImportBackupDto;
use App\Repository\BackupRepository;
use App\Security\IsAuthenticated;
use App\Security\UserValueResolver;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Attribute\MapUploadedFile;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Constraints as Assert;

class BackupController extends AbstractController
{
    public function __construct(
        private readonly string $backupDirectory
    ) {
    }

    #[IsAuthenticated]
    #[Route('/api/backups', name: 'app_api_backups_list', methods: ['GET'])]
    public function listBackups(
        #[MapRequestPayload(resolver: UserValueResolver::class)] User $user,
        BackupRepository $backupRepository,
        SerializerInterface $serializer
    ): Response
    {
        $backups = $backupRepository->findBy(['user' => $user], ['createdAt' => 'DESC']);
        return new Response($serializer->serialize($backups, 'json', ['groups' => 'backup_details']));
    }

    #[IsAuthenticated]
    #[Route('/api/backups', name: 'app_api_backups_create', methods: ['POST'])]
    public function createBackup(
        #[MapRequestPayload(resolver: UserValueResolver::class)] User $user,
        MessageBusInterface $bus
    ): JsonResponse
    {
        $bus->dispatch(new CreateBackupMessage($user->getId()));
        return $this->json(['message' => 'Backup creation initiated.'], Response::HTTP_ACCEPTED);
    }

    #[IsAuthenticated]
    #[Route('/api/backups/import', name: 'app_api_backups_import', methods: ['POST'])]
    public function importBackup(
        #[MapUploadedFile(
            constraints: [
                new Assert\NotBlank(message: 'No file uploaded.'),
                new Assert\File(
                    maxSize: '10M',
                    mimeTypes: ['application/json', 'text/plain'],
                    mimeTypesMessage: 'Please upload a valid JSON file.'
                )
            ],
            name: 'backupFile'
        )] UploadedFile $backupFile,
        #[MapRequestPayload(resolver: UserValueResolver::class)] User $user,
        MessageBusInterface $bus,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $filename = uniqid('import_', true) . '.json';
        $backupFile->move($this->backupDirectory, $filename);

        $backup = (new Backup())
            ->setUser($user)
            ->setFilename($filename)
            ->setType(BackupType::IMPORT)
            ->setStatus(BackupStatus::PENDING);

        $entityManager->persist($backup);
        $entityManager->flush();

        $bus->dispatch(new ImportBackupMessage($backup->getId()));

        return $this->json(['message' => 'Backup import initiated.'], Response::HTTP_ACCEPTED);
    }

    #[IsAuthenticated]
    #[Route('/api/backups/{id}/download', name: 'app_api_backups_download', methods: ['GET'])]
    public function downloadBackup(
        Backup $backup,
        #[MapRequestPayload(resolver: UserValueResolver::class)] User $user
    ): Response
    {
        if ($backup->getUser() !== $user)
        {
            return $this->json(['error' => 'Forbidden'], Response::HTTP_FORBIDDEN);
        }

        if ($backup->getStatus() !== BackupStatus::COMPLETED)
        {
            return $this->json(['error' => 'Backup not yet available.'], Response::HTTP_NOT_FOUND);
        }

        $filePath = $this->backupDirectory . '/' . $backup->getFilename();

        if (!file_exists($filePath))
        {
            return $this->json(['error' => 'File not found.'], Response::HTTP_NOT_FOUND);
        }

        return new BinaryFileResponse($filePath);
    }
}
