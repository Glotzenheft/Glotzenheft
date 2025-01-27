<?php declare(strict_types=1);

namespace App\Enum;

enum MediaType: string
{
    case Movie = 'movie';
    case TV = 'tv';
    case ANIME = 'anime';
}
