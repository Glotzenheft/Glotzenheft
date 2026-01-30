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

import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { UC_NavigateToSpecificPage } from '../../core/use-cases/navigation/navigate-to-specific-page.use-case';
import { CommonModule } from '@angular/common';
import {
    AUTHENTICATION_URLS,
    TMDB_SIDEBAR_URLS,
} from "../../core/constants/urls.constants";

@Component({
    selector: 'app-start-main',
    imports: [
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule,
        ButtonModule,
        CommonModule,
    ],
    templateUrl: './welcome.component.html',
    styleUrl: './welcome.component.css',
    providers: [UC_NavigateToSpecificPage],
})
export class WelcomeComponent {
    public areLoginButtonsVisible: boolean = !isUserLoggedIn();
    public isLoading: boolean = false;

    constructor(
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
    ) {}

    public navigateToLogin = () => {
        this.navigateToSpecificPageUseCase.execute(AUTHENTICATION_URLS.logIn);
    };

    public navigateToDashboard = () => {
        this.navigateToSpecificPageUseCase.execute(TMDB_SIDEBAR_URLS.dashboard);
    };

    public navigateToRegister = () => {
        this.navigateToSpecificPageUseCase.execute(AUTHENTICATION_URLS.register);
    };
}
