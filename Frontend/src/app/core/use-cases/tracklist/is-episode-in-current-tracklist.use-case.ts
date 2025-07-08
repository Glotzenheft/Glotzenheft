import { FormGroup } from "@angular/forms";
import { I_TracklistRepository, IT_TRACKLIST_REPOSITORY } from "../../interfaces/tracklist.repository";
import { SeasonTracklist, TVSeasonWithTracklist } from "../../../shared/interfaces/tracklist-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_IsEpisodeInCurrentTracklist {
    constructor(@Inject(IT_TRACKLIST_REPOSITORY) private readonly tracklistRepository: I_TracklistRepository) { }

    public execute = (episodeID: number, selectedSeason: TVSeasonWithTracklist | null, tracklistosOfSeason: SeasonTracklist[], tracklistSelectionForm: FormGroup<any>): boolean => {
        return this.tracklistRepository.isEpisodeInCurrentTracklist(episodeID, selectedSeason, tracklistosOfSeason, tracklistSelectionForm)
    }
}