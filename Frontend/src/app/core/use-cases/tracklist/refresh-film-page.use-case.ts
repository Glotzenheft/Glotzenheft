import { I_TracklistRepository } from "../../interfaces/tracklist.repository"

export class UC_RefreshFilmPage {
    constructor(private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = () => { return this.tracklistRepository.refreshFilmPage() }
}