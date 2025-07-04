import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_getTracklistCREATEMOVIESubjectResponse {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<any> => {
        return this.mediaRepository.getTracklistCREATEMOVIESubjectResponse()
    }
}