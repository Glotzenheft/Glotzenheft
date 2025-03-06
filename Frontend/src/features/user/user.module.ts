import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { UserStartComponent } from './user-start/user-start.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { ROUTES_LIST } from '../../shared/variables/routes-list';
import { ActivitiesPageComponent } from './activities-page/activities-page.component';
import { DeleteUserAccountPageComponent } from './delete-user-account-page/delete-user-account-page.component';

const userModuleRoutes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: ROUTES_LIST[13].shortUrl,
        component: DeleteUserAccountPageComponent,
      },
      {
        path: ROUTES_LIST[14].shortUrl,
        component: ActivitiesPageComponent,
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
  imports: [CommonModule, RouterModule.forChild(userModuleRoutes)],
})
export class UserModule {}
