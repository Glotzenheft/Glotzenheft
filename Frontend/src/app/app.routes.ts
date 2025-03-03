import { Routes } from '@angular/router';
import { StartMainComponent } from '../features/start/start-main/start-main.component';
import { LoginComponent } from '../features/start/login/login.component';
import { RegisterComponent } from '../features/start/register/register.component';
import { ImpressumComponent } from '../features/components/impressum/impressum.component';
import { AboutComponent } from '../features/components/about/about.component';
import { PrivacyPolicyComponent } from '../features/components/privacy-policy/privacy-policy.component';
import { ROUTES_LIST } from '../shared/variables/routes-list';
import { MultiSearchComponent } from '../features/components/search/multi-search.component';
import { authGuard } from '../guards/auth.guard';
import { ResetPasswordComponent } from '../features/start/reset-password/reset-password.component';
import { AllUserTracklistsComponent } from '../features/media/all-user-tracklists/all-user-tracklists.component';
import { AgbComponent } from '../features/components/agb/agb.component';

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
        (module) => module.UserModule
      ),
    canActivate: [authGuard],
  },
  {
    // 5
    path: 'media',
    loadChildren: () =>
      import('../features/media/media.module').then(
        (module) => module.MediaModule
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
    // 7
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    // 8
    path: ROUTES_LIST[4].fullUrl, // Route für die Multi-Suche
    component: MultiSearchComponent,
    canActivate: [authGuard],
  },
  {
    // 9
    path: ROUTES_LIST[12].fullUrl,
    component: AllUserTracklistsComponent,
    canActivate: [authGuard],
  },
  {
    // 10
    path: ROUTES_LIST[15].fullUrl,
    component: AgbComponent,
  },
  {
    // 19
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
