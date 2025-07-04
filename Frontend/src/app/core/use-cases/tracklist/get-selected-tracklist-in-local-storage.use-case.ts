import { I_TracklistRepository } from "../../interfaces/tracklist.repository";

export class UC_GetSelectedTracklistInLocalStorage {
    constructor(private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (): string | null => { return this.tracklistRepository.getSelectedTracklistInLocalStorage() }
}