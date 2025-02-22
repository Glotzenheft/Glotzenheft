export const ROUTE_MULTI_SEARCH: string =
  'https://127.0.0.1:8000/api/multi-search?q=';

export const ROUTE_MEDIA_DETAILS_SEARCH: string[] = [
  'https://127.0.0.1:8000/api/tv?media_id=',
  '&tmdb_id=',
];
// example: 127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MEDIA_DETAILS_SEARCH_ONLY_TMDB: string =
  'https://127.0.0.1:8000/api/tv?tmdb_id=';

export const ROUTE_MOVIE_DETAILS_SEARCH: string[] = [
  'https://127.0.0.1:8000/api/movie?media_id=',
  '&tmdb_id=',
];
// example: https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MOVIE_DETAILS_SEARCH_ONLY_TMDB: string =
  'https://127.0.0.1:8000/api/movie?tmdb_id=';

export const ROUTE_MEDIA_ID_FOR_MEDIA: string[] = [
  'https://127.0.0.1:8000/api/media?tmdb_id=',
  '&media_type=',
];
// example: https://127.0.0.1:8000/api/media?tmdb_id=205366&media_type=tv

export const ROUTE_SEASON_DETAILS: string =
  'https://127.0.0.1:8000/api/tv/season';

export const ROUTE_RESET_PASSWORD: string = 'https://127.0.0.1:8000/api/user';

export const ROUTE_LOGIN: string = 'https://127.0.0.1:8000/api/login';

// example: https://127.0.0.1:8000/api/tracklist?tracklist_name=Solo Hannes Up&tracklist_status=watching&media_id=2&season_id=1&media_type=tv
export const ROUTE_CREATE_NEW_TRACKLIST: string[] = [
  'https://127.0.0.1:8000/api/tracklist?tracklist_name=', // 0
  '&tracklist_status=', // 1
  '&media_id=', // 2
  '&season_id=', // 3
  '&media_type=', // 4
  '&tracklist_start_date=', // 5
  '&tracklist_finish_date=', // 6
  '&tracklist_rating=', // 7
];

export const ROUTE_GET_ALL_USER_TRACKLISTS: string =
  'https://127.0.0.1:8000/api/user-tracklists';

export const ROUTE_DELETE_USER_ACCOUNT: string =
  'https://127.0.0.1:8000/api/user';

export const ROUTE_UPDATE_TRACKLIST: string[] = [
  'https://127.0.0.1:8000/api/tracklist?tracklist_id=', // 0
  '&tracklist_status=', // 1
  '&tracklist_name=', // 2
  '&tracklist_rating=', // 3
  '&tracklist_start_date=', // 4
  '&tracklist_finish_date=', // 5
];
