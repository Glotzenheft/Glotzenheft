import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { I_MovieRecommendations } from '../../../../app/shared/interfaces/movie-recommendation-interface';
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
import { RecommendationCardComponent } from "../recommendation-card/recommendation-card.component";
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-movie-recommendations',
    imports: [
        ButtonModule,
        CommonModule,
        RecommendationCardComponent,
        ProgressSpinner
    ],
    templateUrl: './movie-recommendations.component.html',
    styleUrl: './movie-recommendations.component.css',
    providers: [
        UC_ShortenString,
        UC_GetMovieRecommendations,
        UC_GetMediaIdForMedia,
        UC_LogoutOfAccount,
        UC_NavigateToSpecificPage
    ]
})
export class MovieRecommendationsComponent {
    public recommendations: I_MovieRecommendations | null = null;
    public isLoading: boolean = false;
    public subscription: Subscription | null = null;
    public areRecommendationsShown: boolean = false;
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;

    // input variables
    public inpMovieId: InputSignal<number> = input.required<number>();
    public inpMovieTitle: InputSignal<string> = input.required<string>();

    // output variables
    public outServerNotAvailable: OutputEmitterRef<boolean> = output<boolean>();

    constructor(
        public shortenStringUseCase: UC_ShortenString,
        private readonly getMovieRecommendationsUseCase: UC_GetMovieRecommendations,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly logOutOfAccountUseCase: UC_LogoutOfAccount,
        private messageService: MessageService,
    ) { }

    public getMovieRecommendations = (movieId: number, movieTitle: string) => {
        if (this.recommendations) {
            // don't load data if user has already got recommendations for this film
            this.areRecommendationsShown = true;
            return;
        }

        this.isLoading = true;
        this.subscription = this.getMovieRecommendationsUseCase.execute(movieId, movieTitle).subscribe({
            next: (response: I_MovieRecommendations) => {
                this.recommendations = response;
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
