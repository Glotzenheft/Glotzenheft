<?php declare(strict_types=1);

namespace App\Enum;

enum BackupType: string
{
    case IMPORT = 'import';
    case EXPORT = 'export';
}
