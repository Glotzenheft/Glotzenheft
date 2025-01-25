import { Routes } from '@angular/router';
import { StartMainComponent } from '../features/start/start-main/start-main.component';
import { LoginComponent } from '../features/start/login/login.component';
import { RegisterComponent } from '../features/start/register/register.component';
import { ImpressumComponent } from '../features/components/impressum/impressum.component';
import { AboutComponent } from '../features/components/about/about.component';
import { PrivacyPolicyComponent } from '../features/components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  {
    path: '',
    component: StartMainComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'user',
    loadChildren: () =>
      import('../features/user/user.module').then(
        (module) => module.UserModule
      ),
  },
  {
    path: 'imprint',
    component: ImpressumComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
];
