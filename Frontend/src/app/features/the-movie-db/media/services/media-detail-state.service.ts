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

import { computed, Injectable, signal } from '@angular/core';
import { TracklistResponseDto } from '../../tracklists/tracklist/models/response/tracklist-response.dto';
import { MediaResponse } from '../models/response/media-response.dto';
import { TracklistEpisodeDetailDataDto } from '../../tracklists/tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';

@Injectable()
export class MediaDetailStateService {
    private readonly data = signal<MediaResponse | null>(null);
    private readonly loading = signal(true);
    private readonly error = signal<string | null>(null);

    readonly mediaData = this.data.asReadonly();
    readonly isLoading = this.loading.asReadonly();
    readonly viewState = computed(() => ({
        loading: this.loading(),
        data: this.data(),
        error: this.error(),
    }));

    startLoading(): void {
        this.loading.set(true);
        this.error.set(null);
        this.data.set(null);
    }

    setMedia(data: MediaResponse): void {
        this.data.set(data);
        this.error.set(null);
        this.loading.set(false);
    }

    setLoadError(message: string): void {
        this.data.set(null);
        this.error.set(message);
        this.loading.set(false);
    }

    upsertTracklist(tracklist: TracklistResponseDto): void {
        this.data.update((current) => {
            if (
                !current ||
                tracklist.media.id !== current.media.id ||
                tracklist.media.type !== current.media.type
            ) {
                return current;
            }
            const exists = current.tracklists.some((item) => item.id === tracklist.id);
            return {
                ...current,
                tracklists: exists
                    ? current.tracklists.map((item) => (item.id === tracklist.id ? tracklist : item))
                    : [...current.tracklists, tracklist],
            };
        });
    }

    upsertTracklistEpisode(tracklistId: number, episode: TracklistEpisodeDetailDataDto): void {
        this.updateEpisodes(tracklistId, (episodes) =>
            episodes.some((item) => item.episode.id === episode.episode.id)
                ? episodes.map((item) => (item.episode.id === episode.episode.id ? episode : item))
                : [...episodes, episode],
        );
    }

    removeTracklistEpisode(tracklistId: number, tracklistEpisodeId: number): void {
        this.updateEpisodes(tracklistId, (episodes) =>
            episodes.some((item) => item.id === tracklistEpisodeId)
                ? episodes.filter((item) => item.id !== tracklistEpisodeId)
                : episodes,
        );
    }

    private updateEpisodes(
        tracklistId: number,
        update: (episodes: TracklistEpisodeDetailDataDto[]) => TracklistEpisodeDetailDataDto[],
    ): void {
        const tracklist = this.data()?.tracklists.find((item) => item.id === tracklistId);
        const season = tracklist?.tracklistSeason;
        if (!tracklist || !season) return;
        const episodes = update(season.tracklistEpisodes);
        if (episodes === season.tracklistEpisodes) return;
        this.upsertTracklist({ ...tracklist, tracklistSeason: { ...season, tracklistEpisodes: episodes } });
    }

    removeTracklist(tracklistId: number): void {
        this.data.update((current) => {
            if (!current || !current.tracklists.some((item) => item.id === tracklistId)) return current;
            return { ...current, tracklists: current.tracklists.filter((item) => item.id !== tracklistId) };
        });
    }
}
