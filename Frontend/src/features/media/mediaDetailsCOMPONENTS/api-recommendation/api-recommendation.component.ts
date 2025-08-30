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

import {
    Component,
    input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
} from '@angular/core';
import { Tooltip } from 'primeng/tooltip';
import { TitleFormattingPipe } from '../../../../pipes/titleFormatting/title-formatting.pipe';
import { ProgressSpinner } from 'primeng/progressspinner';
import { UC_GetAPIRecommendations } from '../../../../app/core/use-cases/media/get-api-recommendations.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_NavigateToSpecificPage } from '../../../../app/core/use-cases/navigation/navigate-to-specific-page.use-case';
import { UC_GetMediaIdForMedia } from '../../../../app/core/use-cases/media/get-media-id-for-media.use-case';
import { UC_ShowLoginMessage } from '../../../../app/core/use-cases/user/show-login-message.use-case';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import { UC_NavigateToPage } from '../../../../app/core/use-cases/navigation/navigate-to-page.use-case';
import { I_APIRecommendationResponse } from '../../../../app/shared/interfaces/recommendation-interfaces';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { MessageService } from 'primeng/api';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { MediaIDResponse } from '../../../../app/shared/interfaces/media-interfaces';

@Component({
    selector: 'app-api-recommendation',
    imports: [Tooltip, TitleFormattingPipe, ProgressSpinner],
    templateUrl: './api-recommendation.component.html',
    styleUrl: './api-recommendation.component.css',
    providers: [
        UC_GetAPIRecommendations,
        UC_LogoutOfAccount,
        UC_NavigateToSpecificPage,
        UC_GetMediaIdForMedia,
        UC_ShowLoginMessage,
        UC_ShortenString,
        UC_NavigateToPage,
    ],
})
export class ApiRecommendationComponent implements OnInit {
    public isLoading: boolean = false;
    public isError: boolean = false;
    public recommendations: I_APIRecommendationResponse | null = null;
    public readonly POSTER_PATH: string = TMDB_POSTER_PATH;

    // input variables
    public inpRecommendations: InputSignal<I_APIRecommendationResponse | null> =
        input.required<I_APIRecommendationResponse | null>();
    public inpIsMovie: InputSignal<boolean> = input.required<boolean>();
    public inpTmdbId: InputSignal<number> = input.required<number>();

    // output variables
    public outSetRecommendations: OutputEmitterRef<I_APIRecommendationResponse> =
        output<I_APIRecommendationResponse>();

    constructor(
        private readonly getAPIRecommendationsUseCase: UC_GetAPIRecommendations,
        private readonly logOutOfAccountUseCase: UC_LogoutOfAccount,
        private readonly messageService: MessageService,
        private readonly navigateToSpecificPageUseCase: UC_NavigateToSpecificPage,
        private readonly navigateToPageUseCase: UC_NavigateToPage,
        private readonly getMediaIdForMediaUseCase: UC_GetMediaIdForMedia,
        private readonly showLoginMessageUseCase: UC_ShowLoginMessage,
        public readonly shortenStringUseCase: UC_ShortenString,
    ) {}

    ngOnInit(): void {
        this.getRecommendations();
    }

    public getRecommendations = () => {
        if (this.inpRecommendations()) {
            this.recommendations = this.inpRecommendations();
            return;
        }

        this.isLoading = true;
        this.getAPIRecommendationsUseCase
            .execute(this.inpTmdbId(), this.inpIsMovie())
            .subscribe({
                next: (response: I_APIRecommendationResponse | null) => {
                    this.recommendations = response;

                    if (response) {
                        this.outSetRecommendations.emit(response);
                    }
                },
                error: (err) => {
                    if (err.status === 401) {
                        this.logOutOfAccountUseCase.execute();
                        this.showLoginMessageUseCase.execute();
                        this.messageService.add(
                            ERR_OBJECT_INVALID_AUTHENTICATION,
                        );
                        this.navigateToSpecificPageUseCase.execute(
                            ROUTES_LIST[10].fullUrl,
                        );
                        return;
                    }

                    this.isError = true;
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
    };

    public onClickRecommendation = (tmdbId: number, isMovie: boolean) => {
        this.getMediaIdForMediaUseCase.execute(tmdbId, isMovie).subscribe({
            next: (res: MediaIDResponse) => {
                if (res.media_id === undefined || res.media_id === null) {
                    this.messageService.add(
                        getMessageObject('error', 'Fehler beim Weiterleiten'),
                    );
                    return;
                }
                this.navigateToPageUseCase.execute(res.media_id, isMovie);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.showLoginMessageUseCase.execute();
                    this.logOutOfAccountUseCase.execute();
                    this.navigateToSpecificPageUseCase.execute(
                        ROUTES_LIST[10].fullUrl,
                    );
                    return;
                }

                this.isError = true;
            },
        });
    };
}
