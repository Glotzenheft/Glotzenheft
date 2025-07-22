/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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