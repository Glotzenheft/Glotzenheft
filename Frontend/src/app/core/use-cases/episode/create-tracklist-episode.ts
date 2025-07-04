import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../../shared/interfaces/tracklist-episode-interfaces";
import { I_EpisodeRepository } from "../../interfaces/episode.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_CreateTracklistEpisode {
    constructor(private readonly episodeRepository: I_EpisodeRepository) { }

    public execute = (tracklistEpisode: CreateTracklistEpisode): Observable<any> | null => {
        return this.episodeRepository.createTracklistEpisode(tracklistEpisode)
    }
}