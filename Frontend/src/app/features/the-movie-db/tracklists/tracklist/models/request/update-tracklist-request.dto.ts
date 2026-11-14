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

import {TracklistStatusEnum} from '../enums/tracklist-status.enum';

/** Omitted fields stay unchanged; explicit null clears a nullable field. */
export interface UpdateTracklistRequestDto {
    tracklist_name?: string;
    tracklist_status?: TracklistStatusEnum;
    is_rewatching?: boolean;
    tracklist_rating?: number | null;
    /** Local date and time in YYYY-MM-DD HH:mm:ss format. */
    tracklist_start_date?: string | null;
    /** Local date and time in YYYY-MM-DD HH:mm:ss format. */
    tracklist_finish_date?: string | null;
    comment?: string | null;
    /** Date in YYYY-MM-DD format. */
    custom_air_date?: string | null;
    language?: string | null;
    subtitle?: string | null;
    custom_poster_path?: string | null;
    start_episode_number?: number | null;
    end_episode_number?: number | null;
    custom_season_number?: number | null;
    custom_part_number?: number | null;
}
