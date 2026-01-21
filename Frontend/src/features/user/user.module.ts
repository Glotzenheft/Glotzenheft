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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserStartComponent } from './user-start/user-start.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { ActivitiesPageComponent } from './activities-page/activities-page.component';
import { DeleteUserAccountPageComponent } from './delete-user-account-page/delete-user-account-page.component';
import { ROUTES_LIST } from '../../app/shared/variables/routes-list';

const userModuleRoutes: Routes = [
    {
        path: '',
        component: UserLayoutComponent,
        children: [
            {
                path: ROUTES_LIST[8].shortUrl,
                component: UserStartComponent,
            },
            {
                path: ROUTES_LIST[13].shortUrl,
                component: DeleteUserAccountPageComponent,
            },
            {
                path: ROUTES_LIST[14].shortUrl,
                component: ActivitiesPageComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'watched',
                        pathMatch: 'full',
                    },
                    {
                        path: 'watched',
                        loadComponent: () =>
                            import(
                                './activities-page/tabs/watched/watched.component'
                                ).then((c) => c.WatchedComponent),
                    },
                    {
                        path: 'completed',
                        loadComponent: () =>
                            import(
                                './activities-page/tabs/completed/completed.component'
                                ).then((c) => c.CompletedComponent),
                    },
                    {
                        path: 'started',
                        loadComponent: () =>
                            import(
                                './activities-page/tabs/started/started.component'
                                ).then((c) => c.StartedComponent),
                    }
                ]
            },
            {
                path: '',
                component: UserStartComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(userModuleRoutes),
        ActivitiesPageComponent
    ],
})
export class UserModule {}
