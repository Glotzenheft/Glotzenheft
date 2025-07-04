import { CreateMovieTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_TriggerTracklistCREATEMOVIESubject {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: CreateMovieTracklistData) => {
        return this.mediaRepository.triggerTracklistCREATEMOVIESubject(tracklistData)
    }
}