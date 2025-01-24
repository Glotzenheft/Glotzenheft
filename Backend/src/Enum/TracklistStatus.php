<?php declare(strict_types=1);

namespace App\Enum;

enum TracklistStatus: string
{
    case WATCHING = 'watching';
    case PAUSING = 'pausing';
    case DROPPED = 'dropped';
    case REWATCHING = 'rewatching';
    case PLAN_TO_WATCH = 'plan to watch';
    case COMPLETED = 'completed';
}
