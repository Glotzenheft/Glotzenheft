import { Inject, Injectable } from "@angular/core";
import { CreateSeasonTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";

@Injectable({ providedIn: 'root' })
export class UC_TriggerTracklistCREATESEASONSubject {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: CreateSeasonTracklistData) => {
        this.mediaRepository.triggerTracklistCREATESEASONSubject(tracklistData)
    }
}