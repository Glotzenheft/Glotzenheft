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
        path: 'settings/backup',
        loadComponent: () =>
            import('../features/backup/pages/backup-page/backup-page.component').then(
                (c) => c.BackupPageComponent
            ),
        canActivate: [authGuard],
    },
    {
        // 19
        path: '**',
        redirectTo: '/',
        pathMatch: 'full',
    },
];
