import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_getTracklistCREATEMOVIESubjectResponse {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<any> => {
        return this.mediaRepository.getTracklistCREATEMOVIESubjectResponse()
    }
}