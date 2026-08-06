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
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { FormGroup } from '@angular/forms';
import {
    ExtractedTracklist,
    TVSeasonWithTracklist,
    TVWithTracklist,
} from '../../shared/interfaces/tracklist-interfaces';
import { InjectionToken } from '@angular/core';
import {MediaResponse} from '../../features/the-movie-db/media/models/response/media-response.dto';
import {
    TracklistResponseDto
} from '../../features/the-movie-db/tracklists/tracklist/models/response/tracklist-response.dto';

export interface I_TracklistRepository {
    joinTVWithTracklists: (data: MediaResponse) => TVWithTracklist;
    extractTracklistsOfTV: (data: MediaResponse) => ExtractedTracklist[];
    isEpisodeInCurrentTracklist: (
        episodeID: number,
        selectedSeason: TVSeasonWithTracklist | null,
        tracklistsOfSeason: TracklistResponseDto[],
        tracklistSelectionForm: FormGroup<any>,
    ) => boolean;
    refreshFilmPage: () => void;
    setSelectedTracklistInLocalStorage: (tracklistID: number) => void;
    getSelectedTracklistInLocalStorage: () => string | null;
}

// IT = Injection Token
export const IT_TRACKLIST_REPOSITORY =
    new InjectionToken<I_TracklistRepository>('I_TracklistRepository');
