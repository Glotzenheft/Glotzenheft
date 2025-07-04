import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Tracklist } from "../../../shared/interfaces/tracklist-interfaces";

export class UC_GetTracklistUPDATEResponseSubject {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<Tracklist> => {
        return this.mediaRepository.getTracklistUPDATEResponseSubject()
    }
}