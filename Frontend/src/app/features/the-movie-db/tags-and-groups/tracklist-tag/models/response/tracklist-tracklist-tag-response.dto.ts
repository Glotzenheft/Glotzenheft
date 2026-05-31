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

import { MediaType} from '../../../../../media/models/media-type.enum';

export interface TracklistTracklistTagResponseDto {
    id: number;
    tracklistName: string;
    mediaId: number;
    mediaName: string;
    mediaOriginalName: string;
    mediaPosterPath: string;
    mediaFirstAirDate: string | null;
    mediaType: MediaType;
    mediaSeasonNumber: number | null;
    mediaSeasonAirDate: string | null;
    mediaSeasonEpisodeCount: string | null;
    mediaSeasonPosterPath: string | null;
    tracklistStatus: string;
    tracklistRating: number | null;
    tracklistCustomAirDate: string | null;
    tracklistStartDateTime: string | null;
    tracklistFinishDateTime: string | null;
    tracklistCustomPosterPath: string | null;
    tracklistLanguage: string | null;
    tracklistSubtitle: string | null;
    tracklistSeasonCustomSeasonNumber: number | null;
    tracklistSeasonCustomPartNumber: number | null;
    tracklistSeasonFirstEpisodeNumber: number | null;
    tracklistSeasonLastEpisodeNumber: number | null;
    watchedEpisodes: number | null;
}
