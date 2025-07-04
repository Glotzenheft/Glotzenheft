import { Observable } from "rxjs";
import { I_EpisodeRepository } from "../../interfaces/episode.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_DeleteTracklistEpisode {
    constructor(private readonly episodeRepository: I_EpisodeRepository) { }

    public execute = (tracklistID: number, tracklistSeasonID: number, tracklistEpisodeId: number): Observable<any> | null => {
        return this.episodeRepository.deleteTracklistEpisode(tracklistID, tracklistSeasonID, tracklistEpisodeId)
    }
}