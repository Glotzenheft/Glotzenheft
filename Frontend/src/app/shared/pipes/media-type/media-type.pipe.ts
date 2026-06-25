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
import {MediaType} from '../../../features/media/models/enums/media-type.enum';

@Pipe({
    name: 'mediaType'
})
export class MediaTypePipe implements PipeTransform {

    transform(value: MediaType | string | null | undefined, ...args: unknown[]): string {
        switch (value) {
            case MediaType.MOVIE:
                return 'Film';
            case MediaType.TV_SHOW:
                return 'Serie';
            default:
                return value ? String(value) : '';
        }
    }
}
