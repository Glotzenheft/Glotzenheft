import { Observable } from "rxjs";
import { UpdateTracklistRequest } from "../../../shared/interfaces/media-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Tracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_UpdateTracklist {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: UpdateTracklistRequest): Observable<Tracklist> => {
        return this.mediaRepository.updateTracklist(tracklistData)
    }
}