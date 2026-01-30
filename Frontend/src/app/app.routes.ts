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
import { WelcomeComponent } from './features/welcome/welcome.component';
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
import {
    AUTHENTICATION_URLS,
    LEGAL_URLS,
    ROOT_URLS,
    SIDEBAR_OPTION_URLS, MEDIA_URLS,
} from "./core/constants/urls.constants";
import { TMDB_SIDEBAR_PATHS } from "./core/constants/paths.constants";

export const routes: Routes = [
    {
        // 0
        path: ROOT_URLS.home,
        component: WelcomeComponent,
    },
    {
        // 1
        path: AUTHENTICATION_URLS.logIn,
        component: LoginComponent,
        canActivate: [authGuard],
    },
    {
        // 2
        path: AUTHENTICATION_URLS.register,
        component: RegisterComponent,
        canActivate: [authGuard],
    },
    {
        // 3
        path: AUTHENTICATION_URLS.resetPassword,
        component: ResetPasswordComponent,
        canActivate: [authGuard],
    },
    {
        // 4
        path: TMDB_SIDEBAR_PATHS.base,
        loadChildren: () => import('../app/features/the-movie-db/tmdb.routes')
            .then(m => m.TMDB_ROUTES),
        canActivate: [authGuard],
    },
    {
        // 5
        path: MEDIA_URLS.baseUrl,
        loadChildren: () =>
            import('../features/media/media.module').then(
                (module) => module.MediaModule,
            ),
        canActivate: [authGuard],
    },
    {
        // 6
        path: LEGAL_URLS.imprint,
        component: ImpressumComponent,
    },
    {
        // 7
        path: LEGAL_URLS.about,
        component: AboutComponent,
    },
    {
        // 8
        path: LEGAL_URLS.privacy,
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
        path: LEGAL_URLS.terms,
        component: AgbComponent,
    },
    {
        // 12
        path: SIDEBAR_OPTION_URLS.dataBackup,
        loadComponent: () =>
            import(
                '../features/backup/pages/backup-page/backup-page.component'
            ).then((c) => c.BackupPageComponent),
        canActivate: [authGuard],
    },
    {
        path: AUTHENTICATION_URLS.deleteAccount,
        loadComponent: () =>
            import(
                '../features/user/delete-user-account-page/delete-user-account-page.component'
            ).then((c) => c.DeleteUserAccountPageComponent),
        canActivate: [authGuard],
    },
    {
        // rest
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    },
];
