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

import { Component, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { I_Recommendations } from '../../../../app/shared/interfaces/movie-recommendation-interface';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { UC_GetMovieRecommendations } from '../../../../app/core/use-cases/media/get-movie-recommendations.use-case';
import { UC_GetMediaIdForMedia } from '../../../../app/core/use-cases/media/get-media-id-for-media.use-case';
import { Subscription } from 'rxjs';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { MessageService } from 'primeng/api';
import { ERR_OBJECT_INVALID_AUTHENTICATION } from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';

@Component({
    selector: 'app-recommendations',
    imports: [
        ButtonModule,
        CommonModule
    ],
    templateUrl: './recommendations.component.html',
    styleUrl: './recommendations.component.css',
    providers: [
        UC_ShortenString,
        UC_GetMovieRecommendations,
        UC_GetMediaIdForMedia,
        UC_LogoutOfAccount,
        UC_NavigateToSpecificPage
    ]
})
export class RecommendationsComponent implements OnInit {
    public recommendations: I_Recommendations | null = null;
    public isLoading: boolean = false;
    public subscription: Subscription | null = null;
    public areRecommendationsShown: boolean = false;
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;

    // input variables
    public inpMovieId: InputSignal<number> = input.required<number>();
    public inpMovieTitle: InputSignal<string> = input.required<string>();
    public inpIsMovie: InputSignal<boolean> = input.required<boolean>();
    public inpRecommendations: InputSignal<I_Recommendations | null> = input.required<I_Recommendations | null>();
    public inpPosterPath: InputSignal<string> = input.required<string>();

    // output variables
    public outServerNotAvailable: OutputEmitterRef<boolean> = output<boolean>();
    public outGetMovieRecommendations: OutputEmitterRef<I_Recommendations> = output<I_Recommendations>();

    constructor(
        public shortenStringUseCase: UC_ShortenString,
        private readonly getMovieRecommendationsUseCase: UC_GetMovieRecommendations,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly logOutOfAccountUseCase: UC_LogoutOfAccount,
        private messageService: MessageService,
    ) { }


    ngOnInit(): void {
        this.getMovieRecommendations();
    }

    public getMovieRecommendations = () => {
        if (this.inpRecommendations()) {
            // don't load data if user has already got recommendations for this film
            this.recommendations = this.inpRecommendations();
            this.areRecommendationsShown = true;
            return;
        }

        this.isLoading = true;
        this.subscription = this.getMovieRecommendationsUseCase.execute(this.inpMovieId(), this.inpMovieTitle(), this.inpIsMovie(), this.inpPosterPath()).subscribe({
            next: (response: I_Recommendations) => {
                this.recommendations = response;
                this.outGetMovieRecommendations.emit(response);
                this.isLoading = false;
                this.areRecommendationsShown = true;
            },
            error: (err) => {
                if (err.status === 401 || err.status === 400) {
                    this.logOutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[10].fullUrl);
                    return;
                } else if (err.status === 0) {
                    // server not available
                    this.outServerNotAvailable.emit(true);
                }

                this.isLoading = false;
            }
        })
    }

    public hideRecommendations = () => {
        this.areRecommendationsShown = false;
    }
}
