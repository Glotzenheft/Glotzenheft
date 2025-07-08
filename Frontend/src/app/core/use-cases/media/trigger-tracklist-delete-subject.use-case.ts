import { Inject, Injectable } from "@angular/core";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";

@Injectable()
export class UC_TriggerTracklistDELETESubject {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistID: number) => {
        return this.mediaRepository.triggerTracklistDELETESubject(tracklistID)
    }
}