import { Component, input, InputSignal } from '@angular/core';
import { I_Recommendation } from '../../../../app/shared/interfaces/movie-recommendation-interface';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { UC_GetMediaIdForMedia } from '../../../../app/core/use-cases/media/get-media-id-for-media.use-case';
import { MediaIDResponse } from '../../../../app/shared/interfaces/media-interfaces';
import { MessageService } from 'primeng/api';
import { getMessageObject } from '../../../../app/shared/variables/message-vars';
import { UC_NavigateToPage } from '../../../../app/core/use-cases/navigation/navigate-to-page.use-case';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { UC_ShowLoginMessage } from '../../../../app/core/use-cases/user/show-login-message.use-case';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { TitleFormattingPipe } from "../../../../pipes/titleFormatting/title-formatting.pipe";
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-recommendation-card',
    imports: [TitleFormattingPipe, TooltipModule],
    templateUrl: './recommendation-card.component.html',
    styleUrl: './recommendation-card.component.css',
    providers: [
        UC_GetMediaIdForMedia,
        UC_NavigateToSpecificPage,
        UC_NavigateToPage,
        UC_ShowLoginMessage,
        UC_ShortenString
    ]
})
export class RecommendationCardComponent {
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;

    // input variables
    public inpRecommendationsList: InputSignal<I_Recommendation[]> = input.required<I_Recommendation[]>();
    public inpTitle: InputSignal<string | null> = input.required<string | null>();


    constructor(
        private readonly getMediaIdForMediaUseCase: UC_GetMediaIdForMedia,
        private readonly messageService: MessageService,
        private readonly navigateToPageUseCase: UC_NavigateToPage,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly showLoginMessageUseCase: UC_ShowLoginMessage,
        public readonly shortenStringUseCase: UC_ShortenString
    ) { }

    public onClickRec = (tmdbId: number, isMovie: boolean) => {
        console.log("tmdbid", tmdbId, "ismovie", isMovie)
        this.getMediaIdForMediaUseCase.execute(tmdbId, isMovie).subscribe({
            next: (res: MediaIDResponse) => {
                if (res.media_id === undefined || res.media_id === null) {
                    // if no media_id exists in the db -> because media is not already saved
                    const summaryMessage: string = `Fehler beim Weiterleiten ${isMovie ? 'zum Film.' : 'zur Serie'
                        }`;

                    this.messageService.add(
                        getMessageObject(
                            'error',
                            summaryMessage,
                            'Bitte lade die Seite erneut und versuche es noch einmal.'
                        )
                    );
                    return;
                }

                this.navigateToPageUseCase.execute(res.media_id, isMovie);
            },
            error: (err) => {
                if (err.status === 401) {
                    // 401 = user token is not logged in anymore -> navigate to login page
                    this.showLoginMessageUseCase.execute();
                    this.navigateToSpecificPageUseCase.execute(ROUTES_LIST[10].fullUrl);
                    return;
                }

                const message: string = `Fehler beim Weiterleiten ${isMovie ? 'zum Film.' : 'zur Serie.'
                    }`;

                this.messageService.add(
                    getMessageObject(
                        'error',
                        message,
                        'Bitte lade die Seite und versuche es erneut.'
                    )
                );
            }
        })
    }
}
