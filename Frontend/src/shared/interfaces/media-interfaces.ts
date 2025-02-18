import { TracklistStatusType } from '../variables/tracklist';

export interface TMDBGenre {
  id: number;
  tmdbGenreID: number;
  name: string;
}

export interface Film {
  id: number; // media id from own db
  tmdbID: number; // tmdb id from external api
  imdbID: string;
  originalName: string;
  name: string;
  description: string;
  firstAirDate: string;
  tmdbGenres: TMDBGenre[];
  seasons: [];
  type: string;
  posterPath: string;
  backdropPath: string;
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

export interface TrackListCreation {
  name: string;
  tmdbId: number;
}

export interface MediaIDResponse {
  media_id: string;
}

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
    id: 1;
    seasonNumber: 1;
    episodes: TracklistSeason[];
  };
}

export interface Tracklist {
  id: number;
  rating: null | number;
  status: TracklistStatusType;
  startDate: null | string;
  finishDate: null | string;
  tracklistName: string;
  media: {
    id: number;
    type: string;
  };
  tracklistSeasons: TracklistSeason[];
}
