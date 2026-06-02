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
import {
    TracklistStatusEnum
} from '../../../features/the-movie-db/tracklists/tracklist/models/enums/tracklist-status.enum';
import {
    TRACKLIST_STATUS_LABELS_DE
} from '../../../features/the-movie-db/tracklists/tracklist/models/constants/tracklist-status.constants';

@Pipe({
    name: 'tracklistStatus',
    standalone: true
})
export class TracklistStatusPipe implements PipeTransform {
    transform(value: TracklistStatusEnum | string | null | undefined): string {
        if (!value) {
            return '';
        }

        const label = TRACKLIST_STATUS_LABELS_DE[value as TracklistStatusEnum];
        return label ?? String(value);
    }
}
