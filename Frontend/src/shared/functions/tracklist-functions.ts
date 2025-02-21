import { Season, SeasonWithEpisodes } from '../interfaces/media-interfaces';
import {
  ExtractedTracklist,
  SeasonTracklist,
  TracklistEpisode,
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../interfaces/tracklist-interfaces';

/**
 * Function for converting a tv (with "media" and "tracklists") into a tv with the tracklists mapped to the seasons.
 * @param data Season
 * @returns TVWithTracklist
 */
export const joinTVWithTracklists = (data: Season): TVWithTracklist => {
  const tvWithTracklist = {
    id: data.media.id,
    tmdbID: data.media.tmdbID,
    imdbID: data.media.imdbID,
    originalName: data.media.originalName,
    name: data.media.name,
    description: data.media.description,
    firstAirDate: data.media.firstAirDate,
    tmdbGenres: data.media.tmdbGenres,
    seasons: data.media.seasons.map((season: SeasonWithEpisodes) => {
      // get all tracklists for the season
      const tracklistWithSeason: {
        tracklistName: string;
        tracklistId: number;
      }[] = [];

      for (const tracklist of data.tracklists) {
        for (const trackSeason of tracklist.tracklistSeasons) {
          if (trackSeason.season.id === season.id) {
            tracklistWithSeason.push({
              tracklistId: tracklist.id,
              tracklistName: tracklist.tracklistName,
            });
          }
        }
      }

      return {
        id: season.id,
        tmdbSeasonID: season.tmdbSeasonID,
        seasonNumber: season.seasonNumber,
        name: season.name,
        overview: season.overview,
        airDate: season.airDate,
        episodeCount: season.episodeCount,
        posterPath: season.posterPath,
        tracklistsForSeason: tracklistWithSeason,
        episodes: season.episodes,
      };
    }),
    type: data.media.type,
    posterPath: data.media.posterPath,
    backdropPath: data.media.backdropPath,
    mediaID: data.media.mediaID,
  };

  return tvWithTracklist;
};

export const extractTracklistsOfTV = (data: Season): ExtractedTracklist[] => {
  return data.tracklists.map((tracklist: SeasonTracklist) => {
    const episodes: { episodeID: number }[] =
      tracklist.tracklistSeasons[0].tracklistEpisodes.map(
        (epi: TracklistEpisode) => {
          return {
            episodeID: epi.id,
          };
        }
      );

    return {
      tracklistId: tracklist.id,
      episodes: episodes,
    };
  });
};
