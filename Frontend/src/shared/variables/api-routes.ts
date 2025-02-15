export const ROUTE_MULTI_SEARCH: string =
  'https://127.0.0.1:8000/api/multi-search?q=';

export const ROUTE_MEDIA_DETAILS_SEARCH: string =
  'https://127.0.0.1:8000/api/tv?media_id=';

//127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MOVIE_DETAILS_SEARCH: string =
  'https://127.0.0.1:8000/api/movie?media_id=';

// https://127.0.0.1:8000/api/tv?media_id=1&tmdb_id=205366

export const ROUTE_MEDIA_ID_FOR_MEDIA: string[] = [
  'https://127.0.0.1:8000/api/media?tmdb_id=',
  '&media_type=',
];
// example: https://127.0.0.1:8000/api/media?tmdb_id=205366&media_type=tv

export const ROUTE_SEASON_DETAILS: string =
  'https://127.0.0.1:8000/api/tv/season';

export const ROUTE_RESET_PASSWORD: string = '';

export const ROUTE_LOGIN: string = 'https://127.0.0.1:8000/api/login';

export const ROUTE_CREATE_NEW_TRACKLIST: string = '';
