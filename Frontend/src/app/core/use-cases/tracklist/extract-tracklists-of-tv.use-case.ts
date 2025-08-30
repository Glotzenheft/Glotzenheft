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

import { Inject, Injectable } from '@angular/core';
import { Season } from '../../../shared/interfaces/media-interfaces';
import { ExtractedTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import {
    I_TracklistRepository,
    IT_TRACKLIST_REPOSITORY,
} from '../../interfaces/tracklist.repository';

@Injectable()
export class UC_ExtractTracklistsOfTV {
    constructor(
        @Inject(IT_TRACKLIST_REPOSITORY)
        private readonly tracklistRepository: I_TracklistRepository,
    ) {}

    public execute = (data: Season): ExtractedTracklist[] => {
        return this.tracklistRepository.extractTracklistsOfTV(data);
    };
}
