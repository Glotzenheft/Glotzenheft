import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../shared/interfaces/tracklist-episode-interfaces";
import { InjectionToken } from "@angular/core";

export interface I_EpisodeRepository {
    createTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    updateTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    deleteTracklistEpisode: (tracklistID: number, tracklistSeasonID: number, tracklistEpisodeId: number) => Observable<any> | null
}

// IT = Injection Token
export const IT_EPISODE_REPOSITORY = new InjectionToken<I_EpisodeRepository>("I_EpisodeRepository")