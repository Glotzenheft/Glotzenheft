<?php declare(strict_types=1);

namespace App\Enum;

enum SecurityQuestions: string
{
    case FIRST_SERIES = 'Welche Serie haben Sie zuerst geschaut?';
    case APP_USAGE_REASON = 'Warum benutzen Sie das Glotzenheft?';
    case PET_COLOR = 'Was war die Farbe Ihres ersten Haustieres?';
    case FAVORITE_MEDIA =  'Was ist Ihre Lieblingsfilm bzw. Ihre Lieblingsserie?';
    case MOST_SHOCKED_ANIME = 'Welcher Anime hat Sie bisher am meisten schockiert?';
    case FAVORITE_STREAMING_SERVICE= 'Was ist Ihr Lieblings-Streamingdienst?';
}
