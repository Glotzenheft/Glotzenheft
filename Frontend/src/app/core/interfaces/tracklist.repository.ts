import { FormGroup } from "@angular/forms";
import { Season } from "../../shared/interfaces/media-interfaces";
import { ExtractedTracklist, SeasonTracklist, TVSeasonWithTracklist, TVWithTracklist } from "../../shared/interfaces/tracklist-interfaces";
import { InjectionToken } from "@angular/core";

export interface I_TracklistRepository {
    joinTVWithTracklists: (data: Season) => TVWithTracklist,
    extractTracklistsOfTV: (data: Season) => ExtractedTracklist[],
    isEpisodeInCurrentTracklist: (episodeID: number, selectedSeason: TVSeasonWithTracklist | null, tracklistsOfSeason: SeasonTracklist[], tracklistSelectionForm: FormGroup<any>) => boolean,
    refreshFilmPage: () => void,
    setSelectedTracklistInLocalStorage: (tracklistID: number) => void,
    getSelectedTracklistInLocalStorage: () => string | null
}

// IT = Injection Token
export const IT_TRACKLIST_REPOSITORY = new InjectionToken<I_TracklistRepository>("I_TracklistRepository")