import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule, Routes } from '@angular/router';
import { UserStartComponent } from './user-start/user-start.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';


const userModuleRoutes: Routes = [
    {
        path: "",
        component: UserLayoutComponent, 
        children: [
            {
                path: "", component: UserStartComponent
            }
        ]
    }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(userModuleRoutes)
  ]
})
export class UserModule { }
