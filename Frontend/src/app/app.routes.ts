import { Routes } from '@angular/router';
import { StartMainComponent } from '../features/start/start-main/start-main.component';
import { LoginComponent } from '../features/start/login/login.component';
import { UserStartComponent } from '../features/user/user-start/user-start.component';

export const routes: Routes = [{
    path: "",
    component: StartMainComponent
}, {
    path: "login",
    component: LoginComponent
}, {
    path: "user",
    loadChildren: () => import("../features/user/user.module").then(module => module.UserModule)
}
];
