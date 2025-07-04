import { Injectable } from "@angular/core";
import { Season } from "../../../shared/interfaces/media-interfaces";
import { ExtractedTracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_TracklistRepository } from "../../interfaces/tracklist.repository";

@Injectable({ providedIn: 'root' })
export class UC_ExtractTracklistsOfTV {
    constructor(private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (data: Season): ExtractedTracklist[] => { return this.tracklistRepository.extractTracklistsOfTV(data) }
}