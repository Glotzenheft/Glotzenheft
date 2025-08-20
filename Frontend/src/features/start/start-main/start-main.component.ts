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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';

@Component({
    selector: 'app-start-main',
    imports: [
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule,
        ButtonModule,
    ],
    templateUrl: './start-main.component.html',
    styleUrl: './start-main.component.css',
})
export class StartMainComponent {
    public areLoginButtonsVisible: boolean = !isUserLoggedIn();

    constructor(private router: Router) { }

    navigateToLogin = () => {
        this.router.navigateByUrl('/login');
    };

    public navigateToStartPage = () => {
        this.router.navigateByUrl(ROUTES_LIST[8].fullUrl);
    };

    navigateToRegister = () => {
        this.router.navigateByUrl('/register');
    };
}
