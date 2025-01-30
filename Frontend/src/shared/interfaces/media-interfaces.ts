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
  episodes: Episode[];
  tmdbSeasonID: string;
  seasonNumber: number;
  name: string;
  overview: string; // description text
  airDate: Date;
  episodeCount: number | null;
  posterPath: string | null;
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
