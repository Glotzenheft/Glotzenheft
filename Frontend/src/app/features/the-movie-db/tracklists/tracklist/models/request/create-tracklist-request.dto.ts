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

import {MediaType} from '../../../../media/models/enums/media-type.enum';
import {TracklistStatusEnum} from '../enums/tracklist-status.enum';
import {UpdateTracklistRequestDto} from './update-tracklist-request.dto';

interface CreateTracklistBaseRequestDto extends UpdateTracklistRequestDto {
    tracklist_name: string;
    tracklist_status: TracklistStatusEnum;
    media_id: number;
}

export interface CreateMovieTracklistRequestDto extends CreateTracklistBaseRequestDto {
    media_type: MediaType.MOVIE;
    season_id?: never;
}

export interface CreateSeasonTracklistRequestDto extends CreateTracklistBaseRequestDto {
    media_type: MediaType.TV_SHOW;
    season_id: number;
}

export type CreateTracklistRequestDto =
    | CreateMovieTracklistRequestDto
    | CreateSeasonTracklistRequestDto;
