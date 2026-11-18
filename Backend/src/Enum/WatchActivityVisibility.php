<?php declare(strict_types=1);

namespace App\Enum;

enum WatchActivityVisibility: string
{
    case PUBLIC = 'public';
    case PRIVATE = 'private';
    case FRIENDS = 'friends';
}
