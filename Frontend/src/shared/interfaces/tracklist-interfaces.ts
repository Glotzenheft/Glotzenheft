import { TracklistStatusType } from '../variables/tracklist';
import { SeasonEpisode } from './media-interfaces';

export interface TrackListCreation {
  name: string;
  tmdbId: number;
}

// tracklists for season -----------------------------------------

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

export interface SeasonTracklistEpisode {
  id: number;
  tmdbEpisodeID: number;
  name: string;
  overview: string;
  episodeNumber: number;
  runtime: number;
  airDate: string;
  stillPath: string;
}

export interface SeasonTracklist {
  id: number;
  media: {
    id: number;
    tmdbID: number;
    imdbID: string;
    originalName: string;
    name: string;
    description: string;
    firstAirDate: string;
    tmdbGenres: {
      id: number;
      tmdbGenreID: number;
      name: string;
    }[];

    seasons: {
      id: number;
      tmdbSeasonID: number;
      seasonNumber: number;
      name: string;
      overview: string;
      airDate: string;
      episodeCount: number;
      posterPath: string;
      episodes: SeasonTracklistEpisode[];
    }[];
    type: string;
    posterPath: string;
    backdropPath: string;
  };
  rating: null | number;
  status: string;
  startDate: null | string;
  finishDate: null | string;
  tracklistName: string;
  tracklistSeasons: {
    id: number;
    tracklistEpisodes: any[];
  }[];
}

export interface SeasonEpisodeWithTracklist {
  id: number;
  tmdbEpisodeID: number;
  name: string;
  overview: string;
  episodeNumber: number;
  runtime: number;
  airDate: string;
  stillPath: string;
  isInCurrentTracklist: boolean;
}

export interface TVSeasonWithTracklist {
  tmdbSeasonID: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string;
  episodeCount: number;
  posterPath: string;
  tracklistsForSeason: { tracklistName: string; tracklistId: number }[];
  episodes: SeasonEpisode[];
}

export interface TVWithTracklist {
  id: number;
  tmdbID: number;
  imdbID: string;
  originalName: string;
  name: string;
  description: string;
  firstAirDate: string;
  tmdbGenres: TracklistForSeasonList[];
  seasons: TVSeasonWithTracklist[];
  type: string;
  posterPath: string;
  backdropPath: string;
  mediaID: string | null;
}

export interface SeasonTracklistType {
  tracklistName: string;
  tracklistId: number;
}

export interface TracklistForSeasonList {
  id: number;
  tmdbGenreID: number;
  name: string;
}
