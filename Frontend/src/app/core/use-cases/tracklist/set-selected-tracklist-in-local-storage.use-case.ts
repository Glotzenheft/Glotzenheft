import { I_TracklistRepository } from "../../interfaces/tracklist.repository";

export class UC_SetSelectedTracklistInLocalStorage {
    constructor(private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (tracklistID: number) => { return this.tracklistRepository.setSelectedTracklistInLocalStorage(tracklistID) }
}