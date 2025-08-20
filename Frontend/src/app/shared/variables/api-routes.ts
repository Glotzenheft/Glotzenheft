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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

const API_ROUTE: string = "/api/";
const SEARCH_ROUTE: string = "search/";


export const ROUTE_MULTI_SEARCH: string[] = [
    API_ROUTE + SEARCH_ROUTE + 'multi?',
    'q=',
    '&include_adult=',
    '&language=',
    '&page=',
];

export const ROUTE_MEDIA_DETAILS_SEARCH: string[] = [
    API_ROUTE + 'tv?media_id=',
    '&tmdb_id=',
];
// example: 127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MEDIA_DETAILS_SEARCH_ONLY_TMDB: string =
    API_ROUTE + 'tv?tmdb_id=';

export const ROUTE_MOVIE_DETAILS_SEARCH: string[] = [
    API_ROUTE + 'movie?media_id=',
    '&tmdb_id=',
];
// example: https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MOVIE_DETAILS_SEARCH_ONLY_TMDB: string =
    API_ROUTE + 'movie?tmdb_id=';

export const ROUTE_MEDIA_ID_FOR_MEDIA: string[] = [
    API_ROUTE + 'media?tmdb_id=',
    '&media_type=',
];
// example: https://127.0.0.1:8000/api/media?tmdb_id=205366&media_type=tv

export const ROUTE_SEASON_DETAILS: string =
    API_ROUTE + 'tv/season';

export const ROUTE_RESET_PASSWORD: string = API_ROUTE + 'user';

export const ROUTE_REGISTER: string = API_ROUTE + "register";

export const ROUTE_LOGIN: string = API_ROUTE + 'login';

// example: https://127.0.0.1:8000/api/tracklist?tracklist_name=Solo Hannes Up&tracklist_status=watching&media_id=2&season_id=1&media_type=tv
export const ROUTE_CREATE_NEW_TRACKLIST: string[] = [
    API_ROUTE + 'tracklist?tracklist_name=', // 0
    '&tracklist_status=', // 1
    '&media_id=', // 2
    '&season_id=', // 3
    '&media_type=', // 4
    '&tracklist_start_date=', // 5
    '&tracklist_finish_date=', // 6
    '&tracklist_rating=', // 7
];

export const ROUTE_GET_ALL_USER_TRACKLISTS: string =
    API_ROUTE + 'user-tracklists';

export const ROUTE_DELETE_USER_ACCOUNT: string =
    API_ROUTE + 'user';

export const ROUTE_UPDATE_TRACKLIST: string[] = [
    API_ROUTE + 'tracklist?tracklist_id=', // 0
    '&tracklist_status=', // 1
    '&tracklist_name=', // 2
    '&tracklist_rating=', // 3
    '&tracklist_start_date=', // 4
    '&tracklist_finish_date=', // 5
];

export const ROUTE_DELETE_TRACKLIST: string =
    API_ROUTE + 'tracklist?tracklist_id=';

// api routes for episodes --------------------------
export const ROUTE_CREATE_TRACKLIST_EPISODE: string[] = [
    API_ROUTE + 'tracklist-episode?tracklist_season_id=',
    '&episode_id=',
    '&watch_date=',
    '&tracklist_id=',
];

export const ROUTE_UPDATE_TRACKLIST_EPISODE: string[] = [
    // for updating the watch date of an episode
    API_ROUTE + 'tracklist-episode?tracklist_id=',
    '&tracklist_season_id=',
    '&tracklist_episode_id=',
    '&watch_date=',
];

export const ROUTE_DELETE_TRACKLIST_EPISODE: string[] = [
    API_ROUTE + 'tracklist-episode?tracklist_id=',
    '&tracklist_season_id=',
    '&tracklist_episode_id=',
];

// api routes for statistics ---------------------------------
export const ROUTE_STATISTIC_GET_WATCHTIME_PER_DAY: string =
    API_ROUTE + 'statistic/watchtime-per-day';

export const ROUTE_USER_ACTIVITIES: string =
    API_ROUTE + 'user-activities?user_activity_page=';

export const ROUTE_STATISTICS_GET_USER_RATINGS: string =
    API_ROUTE + 'statistic/user-ratings';
