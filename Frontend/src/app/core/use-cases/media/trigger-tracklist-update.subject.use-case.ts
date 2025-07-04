import { UpdateTracklistRequest } from "../../../shared/interfaces/media-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_TriggerTracklistUPDATESubject {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: UpdateTracklistRequest) => {
        return this.mediaRepository.triggerTracklistUPDATESubject(tracklistData)
    }
}