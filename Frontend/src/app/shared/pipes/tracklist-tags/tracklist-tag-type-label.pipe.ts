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
import {TracklistTagType} from '../../../features/the-movie-db/tags-and-groups/tracklist-tag/models/tracklist-tag-type.enum';
import {TRACKLIST_TAG_TYPE_LABELS} from '../../../features/the-movie-db/tags-and-groups/tracklist-tag/models/constants/tracklist-tag-type.constants';

@Pipe({
    name: 'tracklistTagTypeLabel',
    standalone: true
})
export class TracklistTagTypeLabelPipe implements PipeTransform {
    transform(value: TracklistTagType | string | null | undefined): string {
        if (!value) return '';
        return TRACKLIST_TAG_TYPE_LABELS[value as TracklistTagType] || value;
    }
}
