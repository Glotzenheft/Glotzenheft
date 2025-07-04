import { Observable } from "rxjs";
import { CreateSeasonTracklistData, Tracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_CreateNewSeasonTracklist {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (data: CreateSeasonTracklistData): Observable<Tracklist> => {
        return this.mediaRepository.createNewSeasonTracklist(data)
    }
}
