import { Inject, Injectable } from "@angular/core";
import { Season } from "../../../shared/interfaces/media-interfaces";
import { ExtractedTracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_TracklistRepository, IT_TRACKLIST_REPOSITORY } from "../../interfaces/tracklist.repository";

@Injectable()
export class UC_ExtractTracklistsOfTV {
    constructor(@Inject(IT_TRACKLIST_REPOSITORY) private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (data: Season): ExtractedTracklist[] => { return this.tracklistRepository.extractTracklistsOfTV(data) }
}