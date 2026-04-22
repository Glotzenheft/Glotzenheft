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

import { TracklistTagType } from "../tracklist-tag-type.enum";

export interface CreateTracklistTagRequestDto {
    tag_name: string;
    tracklist_tag_type: TracklistTagType;
    color?: string | null;
    description?: string | null;
    icon?: string | null;
    tracklist_id?: number | null;
    is_spoiler?: boolean;
    is_adult?: boolean;
}
