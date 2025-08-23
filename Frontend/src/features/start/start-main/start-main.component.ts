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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_NavigateToSpecificPage } from '../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { UC_GetHighestMedia } from '../../../app/core/use-cases/media/get-highest-media.use-case';
import { CommonModule } from '@angular/common';
import { I_HighestRecommendations } from '../../../app/shared/interfaces/movie-recommendation-interface';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';
import { MessageService } from 'primeng/api';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../app/shared/variables/message-vars';
import { RecommendationCardComponent } from "../../media/mediaDetailsCOMPONENTS/recommendation-card/recommendation-card.component";
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-start-main',
    imports: [
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TooltipModule,
        ButtonModule,
        CommonModule,
        RecommendationCardComponent,
        ProgressSpinner
    ],
    templateUrl: './start-main.component.html',
    styleUrl: './start-main.component.css',
    providers: [
        UC_NavigateToSpecificPage,
        UC_GetHighestMedia,
        UC_LogoutOfAccount
    ]
})
export class StartMainComponent implements OnInit {
    public areLoginButtonsVisible: boolean = !isUserLoggedIn();
    public isLoading: boolean = false;
    public highestMedia: I_HighestRecommendations | null = null;
    public isServerNotAvailable: boolean = false;

    constructor(
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly getHighestMediaUseCase: UC_GetHighestMedia,
        private readonly logOutOfAccountUseCase: UC_LogoutOfAccount,
        private readonly messageService: MessageService,
    ) { }

    ngOnInit(): void {
        this.getHighestMedia();
    }

    public navigateToLogin = () => {
        this.navigateToSpecificPageUseCase.execute('/login');
    };

    public navigateToStartPage = () => {
        this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[8].fullUrl);
    };

    public navigateToRegister = () => {
        this.navigateToSpecificPageUseCase.execute('/register');
    };

    public getHighestMedia = () => {
        if (this.highestMedia) return;

        this.isLoading = true;
        this.getHighestMediaUseCase.execute().subscribe({
            next: (response: I_HighestRecommendations) => {
                this.highestMedia = response;
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logOutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[10].fullUrl)
                    return;
                } else if (err.status === 0) {
                    this.isServerNotAvailable = true;
                }
            },
            complete: () => { this.isLoading = false; }
        })
        this.isLoading = false;
    }
}
