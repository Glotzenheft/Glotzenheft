import { Inject, Injectable } from "@angular/core";
import { Season } from "../../../shared/interfaces/media-interfaces";
import { TVWithTracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_TracklistRepository, IT_TRACKLIST_REPOSITORY } from "../../interfaces/tracklist.repository";

@Injectable()
export class UC_JoinTVWithTracklists {
    constructor(@Inject(IT_TRACKLIST_REPOSITORY) private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (data: Season): TVWithTracklist => { return this.tracklistRepository.joinTVWithTracklists(data) }
}