<?php

declare(strict_types=1);

namespace App\Message\Backup;

readonly class ImportBackupMessage
{
    public function __construct(
        private int $backupId
    ){}

    public function getBackupId(): int
    {
        return $this->backupId;
    }
}