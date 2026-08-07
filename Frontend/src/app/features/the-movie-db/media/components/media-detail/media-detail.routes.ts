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
