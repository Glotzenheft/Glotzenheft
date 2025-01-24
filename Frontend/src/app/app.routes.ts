import { Routes } from '@angular/router';
import { StartMainComponent } from '../features/start/start-main/start-main.component';
import { LoginComponent } from '../features/start/login/login.component';
import { RegisterComponent } from '../features/start/register/register.component';

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
];
