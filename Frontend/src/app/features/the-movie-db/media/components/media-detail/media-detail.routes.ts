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

import {Routes} from '@angular/router';
import {MEDIA_DETAILS_PATHS} from '../../../../../core/constants/paths.constants';

export const MEDIA_DETAIL_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./media-detail.component')
            .then(m => m.MediaDetailComponent),
        children: [
            {
                path: '',
                redirectTo: MEDIA_DETAILS_PATHS.tracklists,
                pathMatch: 'full'
            },
            {
                path: MEDIA_DETAILS_PATHS.tracklists,
                loadComponent: () => import('./media-detail-tabs/media-detail-tracklists-tab/media-detail-tracklists-tab.component')
                    .then(m => m.MediaDetailTracklistsTabComponent),
            },
            {
                path: MEDIA_DETAILS_PATHS.recommendations,
                loadComponent: () => import('./media-detail-tabs/media-detail-recommendations-tab/media-detail-recommendations-tab.component')
                    .then(m => m.MediaDetailRecommendationsTabComponent),
            },
            {
                path: MEDIA_DETAILS_PATHS.analytics,
                loadComponent: () => import('./media-detail-tabs/media-detail-analytics-tab/media-detail-analytics-tab.component')
                    .then(m => m.MediaDetailAnalyticsTabComponent),
            },
            {
                path: MEDIA_DETAILS_PATHS.activities,
                loadComponent: () => import('./media-detail-tabs/media-detail-activities-tab/media-detail-activities-tab.component')
                    .then(m => m.MediaDetailActivitiesTabComponent),
            },
            {
                path: MEDIA_DETAILS_PATHS.persons,
                loadComponent: () => import('./media-detail-tabs/media-detail-persons-tab/media-detail-persons-tab.component')
                    .then(m => m.MediaDetailPersonsTabComponent),
            },
        ]
    }
]
