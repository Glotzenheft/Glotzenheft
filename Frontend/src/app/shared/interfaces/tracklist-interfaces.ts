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
import { SeasonEpisode } from './media-interfaces';

export interface TrackListCreation {
    name: string;
    tmdbId: number;
}

export interface CreateMovieTracklistData {
    tracklist_name: string;
    media_id: number;
    tracklist_start_date: string | null;
    tracklist_finish_date: string | null;
    tracklist_status: string;
    tracklist_rating: number | null;
    is_rewatching: boolean;
    media_type: 'movie';
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
}

// tracklists for season -----------------------------------------

export interface TracklistSeasonEpisode {
    id: number;
    name: string;
    overview: string;
    episodeNumber: number;
    runtime: number; // in minutes
    airDate: string;
    stillPath: string;
}

export interface TracklistSeason {
    id: number;
    tracklistEpisodes: any[];
    season: {
        id: number;
        seasonNumber: number;
        episodes: TracklistSeason[];
    };
}

export interface Tracklist {
    asObservable(): import('rxjs').Observable<any> | null;
    id: number;
    rating: null | number;
    status: TracklistStatusType;
    startDate: null | string;
    finishDate: null | string;
    tracklistName: string;
    media: {
        id: number;
        type: string;
        posterPath: string;
    };
    tracklistSeasons: TracklistSeason[];
    isRewatching: boolean;
}

export interface SeasonTracklistEpisode {
    id: number;
    tmdbEpisodeID: number;
    name: string;
    overview: string;
    episodeNumber: number;
    runtime: number;
    airDate: string;
    stillPath: string;
}

export interface SeasonTracklist {
    id: number;
    media: {
        id: number; // id of the tv or movie itself
        type: string; // "movie" or "tv"
    };
    rating: null | number;
    status: string;
    startDate: null | string;
    finishDate: null | string;
    tracklistName: string;
    tracklistSeasons: {
        id: number;
        tracklistEpisodes: TracklistEpisode[];
        season: {
            id: number;
            seasonNumber: number;
        };
    }[];
    isRewatching: boolean;
}

// interfaces for season together with tracklists ----------------------------------------------------

export interface SeasonEpisodeWithTracklist {
    id: number;
    tmdbEpisodeID: number;
    name: string;
    overview: string;
    episodeNumber: number;
    runtime: number;
    airDate: string;
    stillPath: string;
    isInCurrentTracklist: boolean;
}

export interface TVSeasonWithTracklist {
    id: number;
    tmdbSeasonID: number;
    seasonNumber: number;
    name: string;
    overview: string;
    airDate: string;
    episodeCount: number;
    posterPath: string;
    tracklistsForSeason: SeasonTracklist[];
    episodes: SeasonEpisode[];
}

export interface TVWithTracklist {
    id: number;
    tmdbID: number;
    imdbID: string;
    originalName: string;
    name: string;
    description: string;
    firstAirDate: string;
    tmdbGenres: TracklistForSeasonList[];
    seasons: TVSeasonWithTracklist[];
    type: string;
    posterPath: string;
    backdropPath: string;
    mediaID: string | null;
}

export interface SeasonTracklistType {
    tracklistName: string;
    tracklistId: number;
}

export interface TracklistForSeasonList {
    id: number;
    tmdbGenreID: number;
    name: string;
}

export interface ExtractedTracklist {
    tracklistId: number;
    episodes: {
        episodeID: number;
    }[];
}

export interface TracklistEpisode {
    episode: {
        episodeNumber: number;
        id: number;
    };
    id: number;
    watchDate: string;
}
