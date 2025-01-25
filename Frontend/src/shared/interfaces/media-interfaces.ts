export interface Film {}

export interface Episode {
  mediaID: string;
  seasonID: string;
}

export interface Season {
  episodes: Episode[];
  tmdbSeasonID: string;
}

export interface TV {
  // tv series
  seasons: Season[];
}
