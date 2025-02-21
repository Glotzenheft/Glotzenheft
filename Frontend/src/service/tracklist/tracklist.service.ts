import { Injectable } from '@angular/core';
import {
  Season,
  SeasonWithEpisodes,
} from '../../shared/interfaces/media-interfaces';
import {
  ExtractedTracklist,
  SeasonTracklist,
  TracklistEpisode,
  TVSeasonWithTracklist,
  TVWithTracklist,
} from '../../shared/interfaces/tracklist-interfaces';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TracklistService {
  constructor() {}

  /**
   * Function for converting a tv (with "media" and "tracklists") into a tv with the tracklists mapped to the seasons.
   * @param data Season
   * @returns TVWithTracklist
   */
  public joinTVWithTracklists = (data: Season): TVWithTracklist => {
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

  public extractTracklistsOfTV = (data: Season): ExtractedTracklist[] => {
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

  public isEpisodeInCurrenTracklist = (
    episodeID: number,
    selectedSeason: TVSeasonWithTracklist | null,
    tracklistsOfSeason: SeasonTracklist[],
    tracklistSelectionForm: FormGroup<any>
  ): boolean => {
    if (!selectedSeason) {
      return true;
    }

    const selectedTracklistFull: SeasonTracklist[] = tracklistsOfSeason.filter(
      (tracklist: SeasonTracklist) => {
        return (
          tracklist.id ===
          tracklistSelectionForm.get('selectedTracklist')?.value.tracklistId
        );
      }
    );

    if (selectedTracklistFull.length !== 1) {
      return true;
    }

    // checking if given episode is in the first season of all seasons of the tracklist
    // selectedTracklistFull will only be one tracklist + there is only one season per tracklist!
    const trackSeasonEpisodeIDs: number[] =
      selectedTracklistFull[0].tracklistSeasons[0].tracklistEpisodes.map(
        (episode: TracklistEpisode) => {
          return episode.episode_id;
        }
      );

    if (trackSeasonEpisodeIDs.includes(episodeID)) {
      return true;
    }

    return false;
  };
}
