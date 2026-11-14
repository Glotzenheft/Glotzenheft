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

import { MediaType } from '../../../media/models/enums/media-type.enum';
import { MediaDetailDataResponseDto } from '../../../media/models/response/media-detail-data-response.dto';
import { MediaSeasonDetailResponseDto } from '../../../media/models/response/media-season-detail-response.dto';
import { TracklistResponseDto } from './response/tracklist-response.dto';

type TracklistFormMedia = Pick<MediaDetailDataResponseDto, 'id' | 'name' | 'firstAirDate'>;
type TracklistFormSeason = Pick<MediaSeasonDetailResponseDto, 'id' | 'seasonNumber' | 'airDate' | 'episodes'>;

export type TracklistFormDialogData =
    | { mode: 'create'; mediaType: MediaType.MOVIE; media: TracklistFormMedia; season?: never }
    | { mode: 'create'; mediaType: MediaType.TV_SHOW; media: TracklistFormMedia; season: TracklistFormSeason }
    | { mode: 'edit'; tracklist: TracklistResponseDto };

export type TracklistFormDialogResult =
    | { action: 'saved'; tracklist: TracklistResponseDto }
    | { action: 'deleted'; tracklistId: number };
