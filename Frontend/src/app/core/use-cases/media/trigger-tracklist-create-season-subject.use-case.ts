import { CreateSeasonTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_TriggerTracklistCREATESEASONSubject {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tracklistData: CreateSeasonTracklistData) => {
        this.mediaRepository.triggerTracklistCREATESEASONSubject(tracklistData)
    }
}