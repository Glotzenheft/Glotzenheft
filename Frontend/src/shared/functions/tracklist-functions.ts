import { Season, SeasonWithEpisodes } from '../interfaces/media-interfaces';
import {
  SeasonTracklist,
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../interfaces/tracklist-interfaces';

/**
 * Function for converting a tv (with "media" and "tracklists") into a tv with the tracklists mapped to the seasons.
 * @param data Season
 * @returns TVWithTracklist
 */
export const joinTVWithTracklists = (data: Season): TVWithTracklist => {
  const tvSeasonsWithTracklist: TVSeasonWithTracklist[] =
    data.media.seasons.map((season: SeasonWithEpisodes) => ({
      tmdbSeasonID: season.tmdbSeasonID,
      seasonNumber: season.seasonNumber,
      name: season.name,
      overview: season.overview,
      airDate: season.airDate,
      episodeCount: season.episodeCount,
      posterPath: season.posterPath,
      tracklistsForSeason: data.tracklists
        .map((tracklist: SeasonTracklist) => {
          // find all tracklists of the tv for the tv season that include the tv season

          for (const trackSeason of tracklist.media.seasons) {
            if (trackSeason.id === season.id) {
              return {
                tracklistName: tracklist.tracklistName,
                tracklistId: tracklist.id,
              };
            }
          }

          return {
            tracklistName: '',
            tracklistId: -1,
          };
        })
        .filter((tracklist: { tracklistName: string; tracklistId: number }) => {
          // filter out values with name === "" and/ or id < 0 (e.g. -1)
          return (
            tracklist.tracklistName.trim() !== '' && tracklist.tracklistId >= 0
          );
        }),
      episodes: season.episodes,
    }));

  const tvWithTracklist: TVWithTracklist = {
    id: data.media.id,
    tmdbID: data.media.tmdbID,
    imdbID: data.media.imdbID,
    originalName: data.media.originalName,
    name: data.media.name,
    description: data.media.description,
    firstAirDate: data.media.firstAirDate,
    tmdbGenres: data.media.tmdbGenres,
    type: data.media.type,
    posterPath: data.media.posterPath,
    backdropPath: data.media.backdropPath,
    mediaID: data.media.mediaID,
    seasons: tvSeasonsWithTracklist,
  };

  return tvWithTracklist;
};
