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

namespace App\Controller\API\Backup;

use App\Entity\Backup;
use App\Entity\User;
use App\Enum\BackupStatus;
use App\Enum\BackupType;
use App\Message\Backup\CreateBackupMessage;
use App\Message\Backup\ImportBackupMessage;
use App\Model\Request\Backup\BackupIdDto;
use App\Repository\BackupRepository;
use App\Security\IsAuthenticated;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapUploadedFile;
use Symfony\Component\Messenger\Exception\ExceptionInterface;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;

class BackupController extends AbstractController
{
    public function __construct(
        #[Autowire('%env(resolve:BACKUP_DIR)%')]
        private readonly string $backupDirectory,
    ){}

    /**
     * @param User $user
     * @param BackupRepository $backupRepository
     * @return JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/backup',
        name: 'list_all_user_backups',
        methods: ['GET'],
    )]
    public function listAllUserBackupsEndpoint(
        User $user,
        BackupRepository $backupRepository,
    ): JsonResponse
    {
        $backups = $backupRepository->findBy(
            criteria: ['user' => $user],
            orderBy: ['createdAt' => 'DESC']
        );

        return $this->json(
            data: $backups,
            context: [
                'groups' => ['backup_details', 'timestamp']
            ],
        );
    }

    /**
     * @param User $user
     * @param MessageBusInterface $messageBus
     * @return JsonResponse
     * @throws ExceptionInterface
     */
    #[IsAuthenticated]
    #[Route(
        path: '/api/backup',
        name: 'create_user_backup',
        methods: ['POST'],
    )]
    public function createBackupEndpoint(
        User $user,
        MessageBusInterface $messageBus,
    ): JsonResponse
    {
        $messageBus->dispatch(new CreateBackupMessage($user->getId()));

        return $this->json(
            data: [
                'message' => 'Backup creation initiated.',
            ],
            status: Response::HTTP_ACCEPTED
        );
    }

    /**
     * @param UploadedFile $backupFile
     * @param User $user
     * @param MessageBusInterface $messageBus
     * @param EntityManagerInterface $entityManager
     * @return JsonResponse
     * @throws ExceptionInterface
     */
    #[IsAuthenticated]
    #[Route(
        path:'/api/backup/import',
        name: 'import_backup',
        methods: ['POST']
    )]
    public function importBackupEndpoint(
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
        )]
        UploadedFile $backupFile,
        User $user,
        MessageBusInterface $messageBus,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        $filename = uniqid(
            prefix: 'import_',
            more_entropy: true
        ). '.json';

        $backupFile->move(
            directory: $this->backupDirectory,
            name: $filename
        );

        $backup = (new Backup())
            ->setUser($user)
            ->setFilename($filename)
            ->setType(BackupType::IMPORT)
            ->setStatus(BackupStatus::PENDING);

        $entityManager->persist($backup);
        $entityManager->flush();

        $messageBus->dispatch(new ImportBackupMessage($backup->getId()));

        return $this->json(
            data: [
                'message' => 'Backup import initiated.',
            ],
            status: Response::HTTP_ACCEPTED
        );
    }

    /**
     * @param BackupIdDto $dto
     * @param User $user
     * @param BackupRepository $backupRepository
     * @return BinaryFileResponse|JsonResponse
     */
    #[IsAuthenticated]
    #[Route(
        path:'/api/backup/download',
        name: 'download_backup',
        methods: ['GET']
    )]
    public function downloadBackupEndpoint(
        #[MapQueryString] BackupIdDto $dto,
        User $user,
        BackupRepository $backupRepository,
    ): BinaryFileResponse | JsonResponse
    {
        $backup = $backupRepository->find($dto->backupId);
        if (!$backup instanceof Backup)
        {
            return $this->json(
                data: [
                    'message' => 'Backup not found.',
                ],
                status: Response::HTTP_NOT_FOUND
            );
        }
        if ($backup->getUser() !== $user)
        {
            return $this->json(
                data: [
                    'error' => 'Forbidden'
                ],
                status: Response::HTTP_FORBIDDEN
            );
        }

        if ($backup->getStatus() !== BackupStatus::COMPLETED)
        {
            return $this->json(
                data: [
                    'error' => 'Backup not yet available.'
                ],
                status: Response::HTTP_NOT_FOUND);
        }

        $filePath = $this->backupDirectory . '/' . $backup->getFilename();

        if (!file_exists($filePath))
        {
            return $this->json(
                data: [
                    'error' => 'File not found.'
                ],
                status: Response::HTTP_NOT_FOUND);
        }

        return new BinaryFileResponse($filePath);
    }
}
