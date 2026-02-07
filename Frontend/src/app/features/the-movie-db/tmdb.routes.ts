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

import {Routes} from "@angular/router";
import {TMDB_SIDEBAR_PATHS} from "../../core/constants/paths.constants";

export const TMDB_ROUTES: Routes = [
    {
        path: '',
        children: [
            {
                path: TMDB_SIDEBAR_PATHS.dashboard,
                loadComponent: () => import('./dashboard/dashboard.component')
                    .then(m => m.DashboardComponent),
                title: 'Dashboard'
            },
            {
                path: TMDB_SIDEBAR_PATHS.analytics,
                loadComponent: () => import('../../../features/user/user-start/user-start.component')
                    .then(m => m.UserStartComponent),
                title: 'Analyse'
            },
            {
                path: TMDB_SIDEBAR_PATHS.activities,
                loadComponent: () => import('../../../features/user/activities-page/activities-page.component')
                    .then(m => m.ActivitiesPageComponent),
                children: [
                    {
                        path: '',
                        redirectTo: 'watched',
                        pathMatch: 'full',
                    },
                    {
                        path: 'watched',
                        loadComponent: () => import('../../../features/user/activities-page/tabs/watched/watched.component')
                            .then(m => m.WatchedComponent),
                        title: 'Geschaute Episoden/Filme',
                    },
                    {
                        path: 'completed',
                        loadComponent: () => import('../../../features/user/activities-page/tabs/completed/completed.component')
                            .then(m => m.CompletedComponent),
                        title: 'Abgeschlossene Tracklisten',
                    },
                    {
                        path: 'started',
                        loadComponent: () => import('../../../features/user/activities-page/tabs/started/started.component')
                            .then(m => m.StartedComponent),
                        title: 'Gestartete Tracklisten',
                    }
                ],
            },
            {
                path: TMDB_SIDEBAR_PATHS.tracklists,
                loadComponent: () => import('../../../features/user/userTracklists/all-user-tracklists/all-user-tracklists.component')
                    .then(m => m.AllUserTracklistsComponent),
                title: 'Tracklisten'
            },
            {
                path: TMDB_SIDEBAR_PATHS.tagsAndGroups,
                loadComponent: () => import('./tags-and-groups/tags-and-groups.component')
                    .then(m => m.TagsAndGroupsComponent),
                title: 'Glotzentags und Glotzengruppen'
            },
            {
                path: TMDB_SIDEBAR_PATHS.calendar,
                loadComponent: () => import('./calendar/calendar.component')
                    .then(m => m.CalendarComponent),
                title: 'Glotzkalender'
            },
            {
                path: TMDB_SIDEBAR_PATHS.customMedia,
                loadComponent: () => import('./custom-media/custom-media.component')
                    .then(m => m.CustomMediaComponent),
                title: 'Eigene Medien'

            }
        ]
    }
]
