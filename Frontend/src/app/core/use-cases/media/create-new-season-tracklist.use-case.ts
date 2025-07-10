import { Observable } from "rxjs";
import { CreateSeasonTracklistData, Tracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_CreateNewSeasonTracklist {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (data: CreateSeasonTracklistData): Observable<Tracklist> => {
        return this.mediaRepository.createNewSeasonTracklist(data)
    }
}
