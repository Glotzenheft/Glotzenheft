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

import { TRACKLIST_TAG_TYPE_OPTIONS } from '../models/constants/tracklist-tag-type.constants';
import { TracklistTagLightResponseDto } from '../models/response/tracklist-tag-light-response.dto';
import { TracklistTagType } from '../models/tracklist-tag-type.enum';

export interface TracklistTagCategory {
    label: string;
    value: TracklistTagType;
    tags: TracklistTagLightResponseDto[];
}

export function groupTagsByCategory(tags: TracklistTagLightResponseDto[]): TracklistTagCategory[] {
    return TRACKLIST_TAG_TYPE_OPTIONS.map((category) => ({
        ...category,
        tags: tags.filter((tag) => tag.tracklistTagType === category.value),
    }));
}

export function getTagTextColor(color: string | null): string | undefined {
    if (!color || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(color)) return undefined;
    let hex = color.slice(1);
    if (hex.length === 3) hex = [...hex].map((char) => char + char).join('');
    const [r, g, b] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#111827' : '#ffffff';
}