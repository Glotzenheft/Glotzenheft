import { FormGroup } from "@angular/forms";
import { Season } from "../../shared/interfaces/media-interfaces";
import { ExtractedTracklist, SeasonTracklist, TVSeasonWithTracklist, TVWithTracklist } from "../../shared/interfaces/tracklist-interfaces";

export interface I_TracklistRepository {
    joinTVWithTracklists: (data: Season) => TVWithTracklist,
    extractTracklistsOfTV: (data: Season) => ExtractedTracklist[],
    isEpisodeInCurrentTracklist: (episodeID: number, selectedSeason: TVSeasonWithTracklist[] | null, tracklistosOfSeason: SeasonTracklist[], tracklistSelectionForm: FormGroup<any>) => boolean,
    refreshFilmPage: () => void,
    setSelectedTracklistInLocalStorage: (tracklistID: number) => void,
    getSelectedTracklistInLocalStorage: () => string | null
}