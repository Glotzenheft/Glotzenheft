import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_DeleteTracklist {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistId: number): Observable<any> => {
        return this.mediaRepository.deleteTracklist(tracklistId);
    }
}