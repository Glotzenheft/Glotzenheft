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

import { SeasonTracklist } from './tracklist-interfaces';

export interface TMDBGenre {
    id: number;
    tmdbGenreID: number;
    name: string;
}

export interface Film {
    media: {
        id: number; // media id from own db
        tmdbID: number; // tmdb id from external api
        imdbID: string;
        originalName: string;
        name: string;
        description: string;
        firstAirDate: string;
        tmdbGenres: TMDBGenre[];
        seasons: any[];
        type: string;
        posterPath: string;
        backdropPath: string;
    };

    tracklists: SeasonTracklist[];
}

export interface SeasonEpisode {
    id: number;
    tmdbEpisodeID: number;
    name: string;
    overview: string;
    episodeNumber: number;
    runtime: number;
    airDate: string;
    stillPath: string;
}

export interface SeasonWithEpisodes {
    id: number;
    tmdbSeasonID: number;
    seasonNumber: number;
    name: string;
    overview: string;
    airDate: string;
    episodeCount: number;
    posterPath: string;
    episodes: SeasonEpisode[];
}

export interface Season {
    media: {
        id: number;
        tmdbID: number;
        imdbID: string;
        originalName: string;
        name: string;
        description: string;
        firstAirDate: string;
        tmdbGenres: { id: number; tmdbGenreID: number; name: string }[];
        seasons: SeasonWithEpisodes[];
        type: string;
        posterPath: string;
        backdropPath: string;
        mediaID: string | null;
    };
    tracklists: SeasonTracklist[];
}

export interface TV {
    // tv series
    seasons: Season[];
}

export interface MediaResult {
    // attention: title is only available in movies and name only in tv
    release_date: string;
    backdrop_path: string;
    id: number;
    name: string;
    title: string;
    original_name: string;
    overview: string;
    poster_path: string;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
}

export interface MultiSearchResponse {
    page: number;
    results: MediaResult[];
    total_results: number;
    total_pages: number;
}

export interface MediaIDResponse {
    media_id: string;
}

export interface UpdateTracklistRequest {
    tracklist_id: number;
    tracklist_status?: string;
    tracklist_name?: string;
    tracklist_rating?: number | null;
    tracklist_start_date?: string | null;
    tracklist_finish_date?: string | null;
    is_rewatching?: boolean;
}
