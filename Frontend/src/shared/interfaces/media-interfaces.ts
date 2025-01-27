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
