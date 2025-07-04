import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Tracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_GetTracklistCREATESEASONResponseSubject {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<Tracklist> => {
        return this.mediaRepository.getTracklistCREATESEASONResponseSubject()
    }
}