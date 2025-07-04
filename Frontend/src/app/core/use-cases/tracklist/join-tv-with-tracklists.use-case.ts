import { Injectable } from "@angular/core";
import { Season } from "../../../shared/interfaces/media-interfaces";
import { TVWithTracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_TracklistRepository } from "../../interfaces/tracklist.repository";

@Injectable({ providedIn: 'root' })
export class UC_JoinTVWithTracklists {
    constructor(private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (data: Season): TVWithTracklist => { return this.tracklistRepository.joinTVWithTracklists(data) }
}