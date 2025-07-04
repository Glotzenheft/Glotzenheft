import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Season } from "../../../shared/interfaces/media-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_GetSeasonForTV {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (mediaId: string): Observable<Season> | null => {
        return this.mediaRepository.getSeasonForTV(mediaId)
    }
}