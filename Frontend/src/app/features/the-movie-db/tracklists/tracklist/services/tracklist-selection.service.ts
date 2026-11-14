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

import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { KEY_LOCAL_STORAGE_SELECTED_TRACKLIST } from '../../../../../shared/variables/local-storage-keys';

@Injectable({ providedIn: 'root' })
export class TracklistSelectionService {
    private readonly platform = inject(PLATFORM_ID);

    get(mediaId: number, seasonId: number): number | null {
        if (!isPlatformBrowser(this.platform)) return null;
        try {
            const id = Number(
                localStorage.getItem(this.key(mediaId, seasonId)) ??
                    localStorage.getItem(KEY_LOCAL_STORAGE_SELECTED_TRACKLIST),
            );
            return Number.isSafeInteger(id) && id > 0 ? id : null;
        } catch {
            return null;
        }
    }

    set(mediaId: number, seasonId: number, tracklistId: number | null): void {
        if (!isPlatformBrowser(this.platform)) return;
        try {
            const key = this.key(mediaId, seasonId);
            if (tracklistId === null) localStorage.removeItem(key);
            else localStorage.setItem(key, String(tracklistId));
        } catch {
            // Selection remains usable when browser storage is unavailable.
        }
    }

    private key(mediaId: number, seasonId: number): string {
        return `glotzenheft.tracklist-selection.${mediaId}.${seasonId}`;
    }
}
