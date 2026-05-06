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

import { Routes } from '@angular/router';
import { TRACKLIST_TAG_PATHS } from '../../../../../../core/constants/paths.constants';

export const TRACKLIST_TAG_DETAIL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./tracklist-tag-detail.component')
            .then(m => m.TracklistTagDetailComponent),
        children: [
            {
                path: '',
                redirectTo: TRACKLIST_TAG_PATHS.tracklists,
                pathMatch: 'full'
            },
            {
                path: TRACKLIST_TAG_PATHS.tracklists,
                loadComponent: () => import('./tracklist-tag-detail-tracklists-tab/tracklist-tag-detail-tracklists-tab.component')
                    .then(m => m.TracklistTagDetailTracklistsTabComponent)
            },
            {
                path: TRACKLIST_TAG_PATHS.analytics,
                loadComponent: () => import('./tracklist-tag-detail-analytics-tab/tracklist-tag-detail-analytics-tab.component')
                    .then(m => m.TracklistTagDetailAnalyticsTabComponent)
            }
        ]
    }

]
