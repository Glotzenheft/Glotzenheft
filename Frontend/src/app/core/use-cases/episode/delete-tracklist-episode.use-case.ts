import { Observable } from "rxjs";
import { I_EpisodeRepository, IT_EPISODE_REPOSITORY } from "../../interfaces/episode.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_DeleteTracklistEpisode {
    constructor(@Inject(IT_EPISODE_REPOSITORY) private readonly episodeRepository: I_EpisodeRepository) { }

    public execute = (tracklistID: number, tracklistSeasonID: number, tracklistEpisodeId: number): Observable<any> | null => {
        return this.episodeRepository.deleteTracklistEpisode(tracklistID, tracklistSeasonID, tracklistEpisodeId)
    }
}