import { Inject, Injectable } from "@angular/core"
import { I_TracklistRepository, IT_TRACKLIST_REPOSITORY } from "../../interfaces/tracklist.repository"

@Injectable()
export class UC_RefreshFilmPage {
    constructor(@Inject(IT_TRACKLIST_REPOSITORY) private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = () => { return this.tracklistRepository.refreshFilmPage() }
}