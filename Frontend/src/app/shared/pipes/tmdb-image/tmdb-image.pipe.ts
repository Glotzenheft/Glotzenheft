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

import {Pipe, PipeTransform} from '@angular/core';
import {TMDB_IMAGE_URLS} from '../../../core/constants/urls.constants';

type TmdbImageSize = keyof Omit<typeof TMDB_IMAGE_URLS, 'baseUrl'>;

@Pipe({
    name: 'tmdbImage',
    standalone: true
})
export class TmdbImagePipe implements PipeTransform {
    transform(path: string | null | undefined, sizeKey: TmdbImageSize = 'w500PosterUrl'): string {
        if (!path) {
            return '';
        }

        const baseUrl = TMDB_IMAGE_URLS.baseUrl;
        const size = TMDB_IMAGE_URLS[sizeKey];
        return `${baseUrl}${size}/${path}`;
    }
}
