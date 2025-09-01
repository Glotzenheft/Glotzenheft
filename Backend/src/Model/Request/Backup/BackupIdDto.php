<?php

declare(strict_types=1);

namespace App\Model\Request\Backup;

use Symfony\Component\Serializer\Attribute\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

readonly class BackupIdDto
{
    public function __construct(
        #[SerializedName('backup_id')]
        #[Assert\NotBlank(
            message: 'Parameter "backup_id" is required.'
        )]
        public ?int $backupId = null,
    ){}
}