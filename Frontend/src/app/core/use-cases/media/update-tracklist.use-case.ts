import { Observable } from "rxjs";
import { UpdateTracklistRequest } from "../../../shared/interfaces/media-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Tracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_UpdateTracklist {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: UpdateTracklistRequest): Observable<Tracklist> => {
        return this.mediaRepository.updateTracklist(tracklistData)
    }
}