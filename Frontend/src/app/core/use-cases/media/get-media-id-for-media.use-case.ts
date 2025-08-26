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
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { MediaIDResponse } from "../../../shared/interfaces/media-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_GetMediaIdForMedia {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (
        tmdbId: number,
        isMovie: boolean
    ): Observable<MediaIDResponse> => {
        return this.mediaRepository.getMediaIdForMedia(tmdbId, isMovie)
    }
}