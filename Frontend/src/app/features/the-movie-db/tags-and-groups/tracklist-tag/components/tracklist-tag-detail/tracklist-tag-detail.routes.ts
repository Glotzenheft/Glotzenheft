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
