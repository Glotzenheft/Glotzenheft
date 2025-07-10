import { Inject, Injectable } from "@angular/core";
import { UpdateTracklistRequest } from "../../../shared/interfaces/media-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";

@Injectable()
export class UC_TriggerTracklistUPDATESubject {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: UpdateTracklistRequest) => {
        return this.mediaRepository.triggerTracklistUPDATESubject(tracklistData)
    }
}