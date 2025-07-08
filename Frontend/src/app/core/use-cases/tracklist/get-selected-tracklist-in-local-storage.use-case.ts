import { Inject, Injectable } from "@angular/core";
import { I_TracklistRepository, IT_TRACKLIST_REPOSITORY } from "../../interfaces/tracklist.repository";

@Injectable()
export class UC_GetSelectedTracklistInLocalStorage {
    constructor(@Inject(IT_TRACKLIST_REPOSITORY) private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (): string | null => { return this.tracklistRepository.getSelectedTracklistInLocalStorage() }
}