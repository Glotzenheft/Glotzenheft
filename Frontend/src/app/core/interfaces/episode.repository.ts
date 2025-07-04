import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../shared/interfaces/tracklist-episode-interfaces";

export interface I_EpisodeRepository {
    createTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    updateTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    deleteTracklistEpisode: (tracklistID: number, tracklistSeasonID: number, tracklistEpisodeId: number) => Observable<any> | null
}