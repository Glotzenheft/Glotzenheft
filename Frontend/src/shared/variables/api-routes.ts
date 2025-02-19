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
export const ROUTE_CREATE_NEW_SEASON_TRACKLIST: string[] = [
  'https://127.0.0.1:8000/api/tracklist?tracklist_name=',
  '&tracklist_status=',
  '&media_id=',
  '&season_id=',
  '&media_type=',
  '&tracklist_start_date=',
  '&tracklist_finish_date=',
];

// example: https://127.0.0.1:8000/api/tracklist?tracklist_name=Filmliste 1&tracklist_status=watching&media_id=57&media_type=movie&tracklist_start_date=2025-02-16
export const ROUTE_CREATE_NEW_MOVIE_TRACKLIST: string[] = [
  'https://127.0.0.1:8000/api/tracklist?tracklist_name=',
  '&tracklist_status=',
  '&media_id=',
  '&media_type=',
  '&tracklist_start_date=',
  '&tracklist_finish_date=',
];

export const ROUTE_GET_ALL_USER_TRACKLISTS: string =
  'https://127.0.0.1:8000/api/user-tracklists';
