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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

declare(strict_types=1);

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
