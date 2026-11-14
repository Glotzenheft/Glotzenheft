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

import { TracklistStatusType } from '../variables/tracklist';
import { SeasonWithEpisodes } from './media-interfaces';
import {TracklistTags} from './tracklist-tags-interfaces';
import {MediaSeasonDetailResponseDto} from '../../features/the-movie-db/media/models/response/media-season-detail-response.dto';
import {
    TracklistResponseDto
} from '../../features/the-movie-db/tracklists/tracklist/models/response/tracklist-response.dto';
import { MediaDetailDataResponseDto} from '../../features/the-movie-db/media/models/response/media-detail-data-response.dto';

export interface CreateMovieTracklistData {
    tracklist_name: string;
    media_id: number;
    tracklist_start_date: string | null;
    tracklist_finish_date: string | null;
    tracklist_status: string;
    tracklist_rating: number | null;
    is_rewatching: boolean;
    media_type: 'movie';
    comment?: string | null;
    custom_air_date?: string | null;
    language?: string | null;
    subtitle?: string | null;
    custom_poster_path?: string | null;
}

export interface CreateSeasonTracklistData {
    tracklist_name: string;
    media_id: number;
    season_id: number;
    tracklist_start_date: string | null;
    tracklist_finish_date: string | null;
    tracklist_status: string;
    tracklist_rating: number | null;
    is_rewatching: boolean;
    media_type: 'tv';
    comment?: string | null;
    custom_air_date?: string | null;
    language?: string | null;
    subtitle?: string | null;
    custom_poster_path?: string | null;
    start_episode_number?: number | null;
    end_episode_number?: number | null;
    custom_season_number?: number | null;
    custom_part_number?: number | null;
}

// tracklists for season -----------------------------------------
export interface TracklistSeason {
    id: number;
    startEpisodeNumber: number | null;
    endEpisodeNumber: number | null;
    customSeasonNumber: number | null;
    customPartNumber: number | null;
    season: SeasonWithEpisodes;
    tracklistEpisodes: TracklistEpisode[];
}

export interface Tracklist {
    id: number;
    rating: null | number;
    status: TracklistStatusType;
    startDate: null | string;
    finishDate: null | string;
    tracklistName: string;
    comment: string | null;
    customAirDate: string | null;
    language: string | null;
    subtitle: string | null;
    customPosterPath: string | null;
    media: {
        id: number;
        type: string;
        posterPath: string;
    };
    tracklistSeason: TracklistSeason | null;
    isRewatching: boolean;
    tags: TracklistTags[];
    createdAt: string;
    updatedAt: string | null;
}

export interface I_TracklistFormOutput extends Omit<Tracklist, 'media' | 'tags'> {
    customSeasonNumber: number | null;
    customPartNumber: number | null;
    startEpisodeNumber: number | null;
    endEpisodeNumber: number | null;
    tags: TracklistTags[];
}
// interfaces for season together with tracklists ----------------------------------------------------
export interface TVSeasonWithTracklist extends MediaSeasonDetailResponseDto{
    tracklistsForSeason: TracklistResponseDto[];
}

export interface TVWithTracklist extends Omit<MediaDetailDataResponseDto, 'seasons'>{
    seasons: TVSeasonWithTracklist[];
}
export interface ExtractedTracklist {
    tracklistId: number;
    episodes: {
        episodeId: number;
    }[];
}

export interface TracklistEpisode {
    episode: {
        episodeNumber: number;
        id: number;
    };
    id: number;
    watchDateTime: string;
}
