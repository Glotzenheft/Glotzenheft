import { Inject, Injectable } from "@angular/core";
import { CreateMovieTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";

@Injectable()
export class UC_TriggerTracklistCREATEMOVIESubject {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: CreateMovieTracklistData) => {
        return this.mediaRepository.triggerTracklistCREATEMOVIESubject(tracklistData)
    }
}