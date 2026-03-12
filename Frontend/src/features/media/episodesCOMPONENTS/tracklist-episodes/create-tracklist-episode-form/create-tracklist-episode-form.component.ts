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
    EventEmitter,
    input,
    InputSignal,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import {
    SeasonTracklist,
    TracklistEpisode,
} from '../../../../../app/shared/interfaces/tracklist-interfaces';
import { SeasonEpisode } from '../../../../../app/shared/interfaces/media-interfaces';
import {
    CreateTracklistEpisode,
    UpdateTracklistEpisode
} from '../../../../../app/shared/interfaces/tracklist-episode-interfaces';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UC_CreateTracklistEpisode } from '../../../../../app/core/use-cases/episode/create-tracklist-episode';
import { UC_UpdateTracklistEpisode } from '../../../../../app/core/use-cases/episode/update-tracklist-episode.use-case';
import { UC_DeleteTracklistEpisode } from '../../../../../app/core/use-cases/episode/delete-tracklist-episode.use-case';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_SetSelectedTracklistInLocalStorage } from '../../../../../app/core/use-cases/tracklist/set-selected-tracklist-in-local-storage.use-case';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {Image} from 'primeng/image';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../../app/shared/variables/tmdb-vars';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
    selector: 'app-create-tracklist-episode-form',
    imports: [
        ReactiveFormsModule,
        DatePickerModule,
        MessageModule,
        InputTextModule,
        ButtonModule,
        FloatLabelModule,
        SelectModule,
        TooltipModule,
        DeleteDialogComponent,
        DatePipe,
        Image,
        NgOptimizedImage,
        ProgressSpinner
    ],
    providers: [
        UC_CreateTracklistEpisode,
        UC_DeleteTracklistEpisode,
        UC_UpdateTracklistEpisode,
        UC_SetSelectedTracklistInLocalStorage,
        UC_LogoutOfAccount,
    ],
    templateUrl: './create-tracklist-episode-form.component.html',
    styleUrl: './create-tracklist-episode-form.component.css',
})
export class CreateTracklistEpisodeFormComponent implements OnInit {
    // input variables
    public inpTracklist: InputSignal<SeasonTracklist> =
        input.required<SeasonTracklist>();
    public inpEpisode: InputSignal<SeasonEpisode> =
        input.required<SeasonEpisode>();
    public inpSeasonID: InputSignal<number> = input.required<number>();
    public inpIsEpisodeEditing: InputSignal<boolean> =
        input.required<boolean>();

    // output variables
    @Output() saveEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() cancelEpisode: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // other variables
    public createEpisodeForm!: FormGroup;
    public createEpisodeRequestData$: Observable<any> | null = null;
    public updateEpisodeRequestData$: Observable<any> | null = null;
    public deleteEpisodeRequestData$: Observable<any> | null = null;

    public isDeletionDialogVisible: boolean = false;

    public isCreateButtonEnabled: boolean = true;
    public isUpdateButtonEnabled: boolean = true;
    public isDeleteButtonEnabled: boolean = true;
    public isCancelButtonEnabled: boolean = true;

    public posterPath: string = TMDB_POSTER_PATH;
    public originalPosterPath: string = TMDB_ORIGINAL_IMAGE_PATH;

    public isThumbnailLoading = true;
    public imageError = false;

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router,
        private createTracklistEpisodeUseCase: UC_CreateTracklistEpisode,
        private updateTracklistEpisodeUseCase: UC_UpdateTracklistEpisode,
        private deleteTracklistEpisodeUseCase: UC_DeleteTracklistEpisode,
        private logOutOfAccountUseCase: UC_LogoutOfAccount,
        private setSelectedTracklistInLocalStorageUseCase: UC_SetSelectedTracklistInLocalStorage,
    ) {}

    ngOnInit(): void {
        const seasons = this.inpTracklist().tracklistSeasons;
        const currentEpisodeId = this.inpEpisode().id;

        const episodeInTracklist = seasons.length > 0
            ? seasons[0].tracklistEpisodes.find(epis => epis.episode.id === currentEpisodeId)
            : null;

        let initialDate: Date | null;

        if (this.inpIsEpisodeEditing()) {
            initialDate = episodeInTracklist?.watchDateTime
                ? new Date(episodeInTracklist.watchDateTime)
                : null;
        } else {
            initialDate = new Date();
        }

        this.createEpisodeForm = this.formBuilder.group({
            watchDateTime: [initialDate]
        });

        this.setSelectedTracklistInLocalStorageUseCase.execute(
            this.inpTracklist().id
        );
    }

    public disableAllButtons = () => {
        this.isCreateButtonEnabled = false;
        this.isUpdateButtonEnabled = false;
        this.isDeleteButtonEnabled = false;
        this.isCancelButtonEnabled = false;
    };

    public enableAllButtons = () => {
        this.isCreateButtonEnabled = true;
        this.isUpdateButtonEnabled = true;
        this.isDeleteButtonEnabled = true;
        this.isCancelButtonEnabled = true;
    };

    /**
     * Function for add a new episode of the current selected season to the current selected episode.
     * @returns void
     */
    public submitForm = () => {
        this.disableAllButtons();

        const formattedDateTime = this.getFormattedWatchDateTime();

        const createEpisodeData: CreateTracklistEpisode = {
            tracklistId: this.inpTracklist().id,
            tracklistSeasonId: this.inpTracklist().tracklistSeasons[0].id,
            watchDateTime: formattedDateTime || '', // Fallback, falls die API noch zwingend einen String erwartet
            episodeId: this.inpEpisode().id,
        };

        this.executeCreateApiRequest(createEpisodeData);
    };

    public saveEditedEpisode = () => {
        this.disableAllButtons();

        const formattedDateTime = this.getFormattedWatchDateTime();

        const episodeInTracklist = this.inpTracklist().tracklistSeasons[0]?.tracklistEpisodes.find(
            (epis: TracklistEpisode) => epis.episode.id === this.inpEpisode().id
        );

        if (!episodeInTracklist) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Episode nicht gefunden',
                    'Die Episode konnte in der Trackliste nicht gefunden werden.',
                ),
            );
            this.enableAllButtons();
            return;
        }

        const updateEpisodeData: UpdateTracklistEpisode = {
            watchDateTime: formattedDateTime,
            tracklistEpisodeId: episodeInTracklist.id,
        };

        this.executeUpdateApiRequest(updateEpisodeData);
    };

    public deleteEpisode = () => {
        this.disableAllButtons();
        this.setDeletionDialogVisibilityStatus(false);

        const episodeInTracklist = this.inpTracklist().tracklistSeasons[0]?.tracklistEpisodes.find(
            (epis: TracklistEpisode) => epis.episode.id === this.inpEpisode().id
        );

        if (!episodeInTracklist) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Episode nicht gefunden',
                    'Das Löschen ist fehlgeschlagen. Bitte probiere es erneut.',
                ),
            );
            this.enableAllButtons();
            return;
        }

        this.executeDeleteApiRequest(episodeInTracklist.id);
    };

    private executeCreateApiRequest = (episodeData: CreateTracklistEpisode) => {
        this.createEpisodeRequestData$ = this.createTracklistEpisodeUseCase.execute(episodeData);

        if (!this.createEpisodeRequestData$) {
            this.messageService.add(getMessageObject('error', 'Fehler beim Hinzufügen', 'Beim Hinzufügen der Episode ist ein Fehler aufgetreten.'));
            this.enableAllButtons();
            return;
        }

        this.createEpisodeRequestData$.subscribe({
            next: () => {
                this.messageService.add(getMessageObject('success', 'Episode erfolgreich hinzugefügt'));
                this.saveEpisode.emit(true);
                this.enableAllButtons();
            },
            error: (err: any) => this.handleApiError(err, 'Fehler beim Hinzufügen', 'Beim Hinzufügen der Episode ist ein Fehler aufgetreten.')
        });
    };

    private executeUpdateApiRequest = (episodeData: UpdateTracklistEpisode) => {
        this.updateEpisodeRequestData$ = this.updateTracklistEpisodeUseCase.execute(episodeData);

        if (!this.updateEpisodeRequestData$) {
            this.messageService.add(getMessageObject('error', 'Fehler beim Speichern', 'Beim Speichern der Episode ist ein Fehler aufgetreten.'));
            this.enableAllButtons();
            return;
        }

        this.updateEpisodeRequestData$.subscribe({
            next: () => {
                this.messageService.add(getMessageObject('success', 'Episode erfolgreich gespeichert'));
                this.saveEpisode.emit(true);
                this.enableAllButtons();
            },
            error: (err: any) => this.handleApiError(err, 'Fehler beim Speichern', 'Beim Speichern der Episode ist ein Fehler aufgetreten.')
        });
    };

    private executeDeleteApiRequest = (tracklistEpisodeId: number) => {
        this.deleteEpisodeRequestData$ = this.deleteTracklistEpisodeUseCase.execute(tracklistEpisodeId);

        if (!this.deleteEpisodeRequestData$) {
            this.messageService.add(getMessageObject('error', 'Fehler beim Löschen', 'Beim Löschen der Episode ist ein Fehler aufgetreten.'));
            this.enableAllButtons();
            return;
        }

        this.deleteEpisodeRequestData$.subscribe({
            next: () => {
                this.messageService.add(getMessageObject('success', 'Episode erfolgreich gelöscht'));
                this.saveEpisode.emit(true);
                this.enableAllButtons();
            },
            error: (err: any) => this.handleApiError(err, 'Fehler beim Löschen', 'Beim Löschen der Episode ist ein Fehler aufgetreten.')
        });
    };

    /**
     * Liest das Datum aus dem Formular aus und formatiert es im Y-m-d H:i:s Format.
     * Gibt null zurück, wenn kein gültiges Datum eingegeben wurde.
     */
    private getFormattedWatchDateTime = (): string | null => {
        const rawWatchDateTime = this.createEpisodeForm.get('watchDateTime')?.value;

        if (!rawWatchDateTime) {
            return null;
        }

        const date = new Date(rawWatchDateTime);

        if (isNaN(date.getTime())) {
            return null;
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    private handleApiError = (err: any, summary: string, detail: string) => {
        if (err.status === 401) {
            this.logOutOfAccountUseCase.execute();
            this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
            void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
        } else {
            this.messageService.add(getMessageObject('error', summary, detail));
        }
        this.enableAllButtons();
    };

    public cancelEpisodeForm = () => {
        this.cancelEpisode.emit(true);
    };

    public setDeletionDialogVisibilityStatus = (status: boolean) => {
        this.isDeletionDialogVisible = status;
    };

    public handleImageError() {
        this.isThumbnailLoading = false;
        this.imageError = true;
    }
}
