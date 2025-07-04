import { Injectable } from "@angular/core";
import { I_MediaRepository } from "../../interfaces/media.repository";

@Injectable({ providedIn: 'root' })
export class UC_TriggerTracklistDELETESubject {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistID: number) => {
        return this.mediaRepository.triggerTracklistDELETESubject(tracklistID)
    }
}