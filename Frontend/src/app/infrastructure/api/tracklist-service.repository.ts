/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { I_TracklistRepository } from '../../core/interfaces/tracklist.repository';
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
import { KEY_LOCAL_STORAGE_SELECTED_TRACKLIST } from '../../shared/variables/local-storage-keys';

@Injectable({
    providedIn: 'root',
})
export class R_TracklistHttp implements I_TracklistRepository {
    // variables for rerender of season page/ film page
    private filmRefreshSubject = new BehaviorSubject<void>(undefined);
    public refreshFilmPage$ = this.filmRefreshSubject.asObservable();

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    /**
     * Function for converting a tv (with "media" and "tracklists") into a tv with the tracklists mapped to the seasons.
     * @param data Season
     * @returns TVWithTracklist
     */
    public joinTVWithTracklists = (data: Season): TVWithTracklist => {
        return {
            id: data.media.id,
            tmdbId: data.media.tmdbId,
            imdbId: data.media.imdbId,
            originalName: data.media.originalName,
            name: data.media.name,
            description: data.media.description,
            firstAirDate: data.media.firstAirDate,
            tmdbGenres: data.media.tmdbGenres,
            seasons: data.media.seasons
                .map((seasonEntity: SeasonWithEpisodes) => {
                    const tracklistWithSeason: SeasonTracklist[] = [];

                    for (const tracklist of data.tracklists) {
                        if (tracklist.tracklistSeason?.season.id === seasonEntity.id) {
                            tracklistWithSeason.push(tracklist);
                        }
                    }

                    return {
                        id: seasonEntity.id,
                        tmdbSeasonId: seasonEntity.tmdbSeasonId,
                        seasonNumber: seasonEntity.seasonNumber,
                        name: seasonEntity.name,
                        overview: seasonEntity.overview,
                        airDate: seasonEntity.airDate,
                        episodeCount: seasonEntity.episodeCount,
                        posterPath: seasonEntity.posterPath,
                        tracklistsForSeason: tracklistWithSeason,
                        episodes: seasonEntity.episodes,
                    };
                })
                .sort(
                    (
                        seasonA: TVSeasonWithTracklist,
                        seasonB: TVSeasonWithTracklist,
                    ) => seasonA.seasonNumber - seasonB.seasonNumber,
                ),
            type: data.media.type,
            posterPath: data.media.posterPath,
            backdropPath: data.media.backdropPath,
            mediaId: data.media.mediaId,
        };
    };

    public extractTracklistsOfTV = (data: Season): ExtractedTracklist[] => {
        return data.tracklists.map((tracklist: SeasonTracklist) => {
            const episodes: { episodeId: number }[] =
                tracklist.tracklistSeason?.tracklistEpisodes.map(
                    (epi: TracklistEpisode) => {
                        return {
                            episodeId: epi.episode.id,
                        };
                    },
                ) || [];

            return {
                tracklistId: tracklist.id,
                episodes: episodes,
            };
        });
    };

    public isEpisodeInCurrentTracklist = (
        episodeID: number,
        selectedSeason: TVSeasonWithTracklist | null,
        tracklistsOfSeason: SeasonTracklist[],
        tracklistSelectionForm: FormGroup<any>,
    ): boolean => {
        if (!selectedSeason) {
            return true;
        }

        const selectedTracklistFull: SeasonTracklist[] =
            tracklistsOfSeason.filter((tracklist: SeasonTracklist) => {
                return (
                    tracklist.id ===
                    tracklistSelectionForm.get('selectedTracklist')?.value
                        .tracklistId
                );
            });

        if (selectedTracklistFull.length !== 1) {
            return true;
        }

        const currentTracklistSeason = selectedTracklistFull[0].tracklistSeason;

        if (!currentTracklistSeason) {
            return false;
        }

        const trackSeasonEpisodeIDs: number[] =
            currentTracklistSeason.tracklistEpisodes.map(
                (episode: TracklistEpisode) => {
                    return episode.episode.id;
                },
            );

        return trackSeasonEpisodeIDs.includes(episodeID);
    };

    // functions for refreshing pages ---------------------------
    public refreshFilmPage = () => {
        this.filmRefreshSubject.next();
    };

    // functions for managing the current selected tracklist in season page component in local storage
    public setSelectedTracklistInLocalStorage = (tracklistID: number) => {
        // setting the current selected tracklist in the local storage
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(
                KEY_LOCAL_STORAGE_SELECTED_TRACKLIST,
                tracklistID.toString(),
            );
        }
    };

    public getSelectedTracklistInLocalStorage = (): string | null => {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(KEY_LOCAL_STORAGE_SELECTED_TRACKLIST);
        }

        return null;
    };
}
