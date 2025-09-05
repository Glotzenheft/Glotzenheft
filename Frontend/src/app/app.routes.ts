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
import { StartMainComponent } from '../features/start/start-main/start-main.component';
import { LoginComponent } from '../features/start/login/login.component';
import { RegisterComponent } from '../features/start/register/register.component';
import { authGuard } from '../guards/auth.guard';
import { ResetPasswordComponent } from '../features/start/reset-password/reset-password.component';
import { ImpressumComponent } from '../features/footerCOMPONENTS/impressum/impressum.component';
import { AboutComponent } from '../features/footerCOMPONENTS/about/about.component';
import { PrivacyPolicyComponent } from '../features/footerCOMPONENTS/privacy-policy/privacy-policy.component';
import { MultiSearchComponent } from '../features/media/mediaSearchCOMPONENTS/search/multi-search.component';
import { AllUserTracklistsComponent } from '../features/user/userTracklists/all-user-tracklists/all-user-tracklists.component';
import { AgbComponent } from '../features/footerCOMPONENTS/agb/agb.component';
import { ROUTES_LIST } from './shared/variables/routes-list';

export const routes: Routes = [
    {
        // 0
        path: '',
        component: StartMainComponent,
    },
    {
        // 1
        path: 'login',
        component: LoginComponent,
        canActivate: [authGuard],
    },
    {
        // 2
        path: 'register',
        component: RegisterComponent,
        canActivate: [authGuard],
    },
    {
        // 3
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [authGuard],
    },
    {
        // 4
        path: 'user',
        loadChildren: () =>
            import('../features/user/user.module').then(
                (module) => module.UserModule,
            ),
        canActivate: [authGuard],
    },
    {
        // 5
        path: 'media',
        loadChildren: () =>
            import('../features/media/media.module').then(
                (module) => module.MediaModule,
            ),
        canActivate: [authGuard],
    },
    {
        // 6
        path: 'imprint',
        component: ImpressumComponent,
    },
    {
        // 7
        path: 'about',
        component: AboutComponent,
    },
    {
        // 8
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
    },
    {
        // 9
        path: ROUTES_LIST[4].fullUrl, // Route für die Multi-Suche
        component: MultiSearchComponent,
        canActivate: [authGuard],
    },
    {
        // 10
        path: ROUTES_LIST[12].fullUrl,
        component: AllUserTracklistsComponent,
        canActivate: [authGuard],
    },
    {
        // 11
        path: ROUTES_LIST[15].fullUrl,
        component: AgbComponent,
    },
    {
        // 12
        path: ROUTES_LIST[16].fullUrl,
        loadComponent: () =>
            import(
                '../features/backup/pages/backup-page/backup-page.component'
            ).then((c) => c.BackupPageComponent),
        canActivate: [authGuard],
    },
    {
        // rest
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    },
];
