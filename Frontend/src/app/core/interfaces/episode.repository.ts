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

import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../shared/interfaces/tracklist-episode-interfaces";
import { InjectionToken } from "@angular/core";

export interface I_EpisodeRepository {
    createTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    updateTracklistEpisode: (tracklistEpisode: CreateTracklistEpisode) => Observable<any> | null,
    deleteTracklistEpisode: (tracklistID: number, tracklistSeasonID: number, tracklistEpisodeId: number) => Observable<any> | null
}

// IT = Injection Token
export const IT_EPISODE_REPOSITORY = new InjectionToken<I_EpisodeRepository>("I_EpisodeRepository")