import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_DeleteTracklist {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistId: number): Observable<any> => {
        return this.mediaRepository.deleteTracklist(tracklistId);
    }
}