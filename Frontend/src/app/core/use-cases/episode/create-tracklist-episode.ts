import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../../shared/interfaces/tracklist-episode-interfaces";
import { I_EpisodeRepository, IT_EPISODE_REPOSITORY } from "../../interfaces/episode.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_CreateTracklistEpisode {
    constructor(@Inject(IT_EPISODE_REPOSITORY) private readonly episodeRepository: I_EpisodeRepository) { }

    public execute = (tracklistEpisode: CreateTracklistEpisode): Observable<any> | null => {
        return this.episodeRepository.createTracklistEpisode(tracklistEpisode)
    }
}