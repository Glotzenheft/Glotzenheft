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

import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { TracklistSeasonDetailDataDto } from '../models/response/tracklist-season/tracklist-season-detail-data.dto';

export const EPISODE_REQUEST_TIMEOUT_MS = 30_000;

export function unknownEpisodeWriteResult(error: unknown): boolean {
    return (
        error instanceof TimeoutError ||
        (error instanceof HttpErrorResponse && [0, 408, 504].includes(error.status))
    );
}

export function inTracklistRange(number: number, season: TracklistSeasonDetailDataDto): boolean {
    return (
        (season.startEpisodeNumber === null || number >= season.startEpisodeNumber) &&
        (season.endEpisodeNumber === null || number <= season.endEpisodeNumber)
    );
}
