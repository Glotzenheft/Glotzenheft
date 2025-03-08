import { TracklistStatusType } from '../variables/tracklist';
import { SeasonEpisode } from './media-interfaces';

export interface TrackListCreation {
  name: string;
  tmdbId: number;
}

export interface CreateMovieTracklistData {
  name: string;
  mediaID: number;
  startDate: string | null;
  endDate: string | null;
  status: string;
  rating: number | null;
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
  asObservable(): import('rxjs').Observable<any> | null;
  id: number;
  rating: null | number;
  status: TracklistStatusType;
  startDate: null | string;
  finishDate: null | string;
  tracklistName: string;
  media: {
    id: number;
    type: string;
    posterPath: string;
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
    id: number; // id of the tv or movie itself
    type: string; // "movie" or "tv"
  };
  rating: null | number;
  status: string;
  startDate: null | string;
  finishDate: null | string;
  tracklistName: string;
  tracklistSeasons: {
    id: number;
    tracklistEpisodes: TracklistEpisode[];
    season: {
      id: number;
      seasonNumber: number;
    };
  }[];
}

// interfaces for season together with tracklists ----------------------------------------------------

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
  id: number;
  tmdbSeasonID: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string;
  episodeCount: number;
  posterPath: string;
  tracklistsForSeason: SeasonTracklist[];
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

export interface ExtractedTracklist {
  tracklistId: number;
  episodes: {
    episodeID: number;
  }[];
}

export interface TracklistEpisode {
  episode: {
    episodeNumber: number;
    id: number;
  };
  id: number;
  watchDate: string;
}
