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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Observable } from "rxjs";
import { CreateTracklistEpisode } from "../../../shared/interfaces/tracklist-episode-interfaces";
import { I_EpisodeRepository, IT_EPISODE_REPOSITORY } from "../../interfaces/episode.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_UpdateTracklistEpisode {
    constructor(@Inject(IT_EPISODE_REPOSITORY) private readonly episodeRepository: I_EpisodeRepository) { }

    public execute = (tracklistEpisode: CreateTracklistEpisode): Observable<any> | null => {
        return this.episodeRepository.updateTracklistEpisode(tracklistEpisode)
    }
}