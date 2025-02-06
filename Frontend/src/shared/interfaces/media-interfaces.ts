export interface Film {}

export interface Episode {
  mediaID: string;
  seasonID: string;
  name: string;
  description: string;
  episodeNumber: number;
  runtime: number | null;
  posterPath: string | null;
  airDate: Date | null;
}

export interface Season {
  id: number;
  tmdbID: number;
  imdbID: string;
  originalName: string;
  name: string;
  description: string;
  firstAirDate: string;
  tmdbGenres: { id: number; tmdbGenreID: number; name: string }[];
  seasons: any[];
  type: string;
  posterPath: string;
  backdropPath: string;
  mediaID: string | null;
}

export interface TV {
  // tv series
  seasons: Season[];
}

export interface MediaResult {
  // attention: title is only available in movies and name only in tv
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
  total_results: 3;
  total_pages: 1;
}
