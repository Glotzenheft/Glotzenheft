import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Season } from "../../../shared/interfaces/media-interfaces";

export class UC_GetSeasonForTV {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (mediaId: string): Observable<Season> | null => {
        return this.mediaRepository.getSeasonForTV(mediaId)
    }
}