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
import { SeasonTracklist, TracklistEpisode } from '../../../../../app/shared/interfaces/tracklist-interfaces';
import { SeasonEpisode } from '../../../../../app/shared/interfaces/media-interfaces';
import { CreateTracklistEpisode } from '../../../../../app/shared/interfaces/tracklist-episode-interfaces';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UC_CreateTracklistEpisode } from '../../../../../app/core/use-cases/episode/create-tracklist-episode';
import { UC_UpdateTracklistEpisode } from '../../../../../app/core/use-cases/episode/update-tracklist-episode.use-case';
import { UC_DeleteTracklistEpisode } from '../../../../../app/core/use-cases/episode/delete-tracklist-episode.use-case';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_SetSelectedTracklistInLocalStorage } from '../../../../../app/core/use-cases/tracklist/set-selected-tracklist-in-local-storage.use-case';
import { DatePipe } from '@angular/common';

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
        DatePipe
    ],
    providers: [
        UC_CreateTracklistEpisode,
        UC_DeleteTracklistEpisode,
        UC_UpdateTracklistEpisode,
        UC_SetSelectedTracklistInLocalStorage,
        UC_LogoutOfAccount
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
    public inpIsEpisodeEditing: InputSignal<boolean> = input.required<boolean>();

    // output variables
    @Output() saveEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() cancelEpisode: EventEmitter<boolean> = new EventEmitter<boolean>();

    // other variables
    public createEpisodeForm!: FormGroup;
    public createEpisodeRequestData$: Observable<any> | null = null;
    public updateEpisodeRequestData$: Observable<any> | null = null;
    public deleteEpisodeRequestData$: Observable<any> | null = null;

    public isDeletionDialogVisible: boolean = false;

    public isCreateButtonEnabled: boolean = true;
    public isUpdateButtonEnabled: boolean = true;
    public isDeleteButtonEnabled: boolean = true;
    public isCancelButtonEnabled: boolean = true

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router,
        private createTracklistEpisodeUseCase: UC_CreateTracklistEpisode,
        private updateTracklistEpisodeUseCase: UC_UpdateTracklistEpisode,
        private deleteTracklistEpisodeUseCase: UC_DeleteTracklistEpisode,
        private logOutOfAccountUseCase: UC_LogoutOfAccount,
        private setSelectedTracklistInLocalStorageUseCase: UC_SetSelectedTracklistInLocalStorage
    ) { }

    ngOnInit(): void {
        // extract the episode of the tracklist (for retrieving e. g. watchDate and trakcklist episode id)
        const episodeInTracklist =
            this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
                (epis: TracklistEpisode) => {
                    return this.inpEpisode().id === epis.episode.id;
                }
            );

        const isEpisodeInTracklist: boolean =
            episodeInTracklist.length === 1 && this.inpIsEpisodeEditing();

        if (episodeInTracklist[0] && episodeInTracklist[0].watchDate) {
            const watchDateAsDate = new Date(episodeInTracklist[0].watchDate);
            watchDateAsDate.setHours(watchDateAsDate.getHours());
            this.createEpisodeForm = this.formBuilder.group({
                watchDate: [
                    isEpisodeInTracklist &&
                        episodeInTracklist[0] &&
                        episodeInTracklist[0].watchDate &&
                        episodeInTracklist[0].watchDate.length > 0
                        ? watchDateAsDate
                        : null,
                ],
            });
            return;
        }
        this.createEpisodeForm = this.formBuilder.group({
            watchDate: [!this.inpIsEpisodeEditing() ? new Date() : null],
        });

        // set local storage tracklist to selected tracklist
        this.setSelectedTracklistInLocalStorageUseCase.execute(
            this.inpTracklist().id
        );
    }

    public disableAllButtons = () => {
        this.isCreateButtonEnabled = false;
        this.isUpdateButtonEnabled = false;
        this.isDeleteButtonEnabled = false;
        this.isCancelButtonEnabled = false;
    }

    public enableAllButtons = () => {
        this.isCreateButtonEnabled = true;
        this.isUpdateButtonEnabled = true;
        this.isDeleteButtonEnabled = true;
        this.isCancelButtonEnabled = true;
    }

    /**
     * Function for add a new episode of the current selected season to the current selected episode.
     * @returns void
     */
    public submitForm = () => {
        this.disableAllButtons();

        this.isCreateButtonEnabled = false
        const watchDate: string | null =
            this.createEpisodeForm.get('watchDate')?.value;
        let formattedDate: string = '';

        if (watchDate !== null) {
            const watchDateAsDate = new Date(watchDate);

            const year = watchDateAsDate.getFullYear();
            const month = String(watchDateAsDate.getMonth() + 1).padStart(2, '0');
            const day = String(watchDateAsDate.getDate()).padStart(2, '0');
            const hours = String(watchDateAsDate.getHours()).padStart(2, '0');
            const minutes = String(watchDateAsDate.getMinutes()).padStart(2, '0');
            const seconds = String(watchDateAsDate.getSeconds()).padStart(2, '0');

            formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const createEpisodeData: CreateTracklistEpisode = {
            tracklistID: this.inpTracklist().id,
            tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
            watchDate: formattedDate,
            episodeID: this.inpEpisode().id,
        };

        this.makeAPIRequest(createEpisodeData, 0);
    };

    public saveEditedEpisode = () => {
        this.disableAllButtons();

        const watchDate: string | null =
            this.createEpisodeForm.get('watchDate')?.value;
        let formattedDate: string = '';

        if (watchDate !== null) {
            const watchDateAsDate = new Date(watchDate);

            const year = watchDateAsDate.getFullYear();
            const month = String(watchDateAsDate.getMonth() + 1).padStart(2, '0');
            const day = String(watchDateAsDate.getDate()).padStart(2, '0');
            const hours = String(watchDateAsDate.getHours()).padStart(2, '0');
            const minutes = String(watchDateAsDate.getMinutes()).padStart(2, '0');
            const seconds = String(watchDateAsDate.getSeconds()).padStart(2, '0');

            formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }

        const episodeInTracklist =
            this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
                (epis: TracklistEpisode) => {
                    return this.inpEpisode().id === epis.episode.id;
                }
            );

        const updateEpisodeData: CreateTracklistEpisode = {
            tracklistID: this.inpTracklist().id,
            tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
            watchDate: formattedDate,
            episodeID: episodeInTracklist[0].id, // tracklist episode id
        };

        this.makeAPIRequest(updateEpisodeData, 1);
    };

    public deleteEpisode = () => {
        this.disableAllButtons();
        this.setDeletionDialogVisibilityStatus(false);

        const episodeInTracklist =
            this.inpTracklist().tracklistSeasons[0].tracklistEpisodes.filter(
                (epis: TracklistEpisode) => {
                    return this.inpEpisode().id === epis.episode.id;
                }
            );

        if (episodeInTracklist.length < 1) {
            this.messageService.add(
                getMessageObject(
                    'error',
                    'Episode nicht gefunden',
                    'Das Löschen ist fehlgeschlagen. Bitte probiere es erneut.'
                )
            );

            return;
        }

        const deleteEpisodeData: CreateTracklistEpisode = {
            tracklistID: this.inpTracklist().id,
            tracklistSeasonID: this.inpTracklist().tracklistSeasons[0].id,
            watchDate: '',
            episodeID: episodeInTracklist[0].id, // tracklist episode id
        };

        this.makeAPIRequest(deleteEpisodeData, 2);
    };

    /**
     *
     * @param episodeData CreateTracklistEpisode
     * @param episodeActionNumber number -> 0 (create), 1 (update) or 2 (delete) episode
     * @returns
     */
    public makeAPIRequest = (
        episodeData: CreateTracklistEpisode,
        episodeActionNumber: number
    ) => {
        this.disableAllButtons();

        // = 0: create episode; = 1: update selected episode; = 2: delete episode
        const errorMessageSummary: string =
            episodeActionNumber === 0
                ? 'Fehler beim Hinzufügen der Episode'
                : episodeActionNumber === 1
                    ? 'Fehler beim Speichern der Episode'
                    : 'Fehler beim Löschen der Episode';

        const errorMessageDetail: string =
            episodeActionNumber === 0
                ? 'Beim Hinzufügen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.'
                : episodeActionNumber === 1
                    ? 'Beim Speichern der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.'
                    : 'Beim Löschen der Episode ist ein Fehler aufgetreten. Bitte probiere es erneut.';

        if (episodeActionNumber === 0) {
            this.createEpisodeRequestData$ =
                this.createTracklistEpisodeUseCase.execute(episodeData);

            if (!this.createEpisodeRequestData$) {
                this.messageService.add(
                    getMessageObject('error', errorMessageSummary, errorMessageDetail)
                );
                return;
            }

            this.createEpisodeRequestData$.subscribe({
                next: () => {
                    this.messageService.add(
                        getMessageObject('success', 'Episode erfolgreich hinzugefügt')
                    );
                    this.saveEpisode.emit(true);
                },
                error: (err: any) => {
                    if (err.status === 401) {
                        // logout user of account
                        this.logOutOfAccountUseCase.execute();
                        this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                        this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                        return;
                    }
                    this.messageService.add(
                        getMessageObject('error', errorMessageSummary, errorMessageDetail)
                    );
                },
            });

            return;
        } else if (episodeActionNumber === 1) {
            // updating episode
            this.updateEpisodeRequestData$ =
                this.updateTracklistEpisodeUseCase.execute(episodeData);

            if (!this.updateEpisodeRequestData$) {
                this.messageService.add(
                    getMessageObject('error', errorMessageSummary, errorMessageDetail)
                );
                return;
            }

            this.updateEpisodeRequestData$.subscribe({
                next: () => {
                    this.messageService.add(
                        getMessageObject('success', 'Episode erfolgreich gespeichert')
                    );
                    this.saveEpisode.emit(true);
                },
                error: (err: any) => {
                    if (err.status === 401) {
                        this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                        return;
                    }
                    this.messageService.add(
                        getMessageObject('error', errorMessageSummary, errorMessageDetail)
                    );
                },
            });
        } else if (episodeActionNumber === 2) {
            // delete episode
            this.deleteEpisodeRequestData$ =
                this.deleteTracklistEpisodeUseCase.execute(
                    episodeData.tracklistID,
                    episodeData.tracklistSeasonID,
                    episodeData.episodeID
                );

            if (!this.deleteEpisodeRequestData$) {
                this.messageService.add(
                    getMessageObject('error', errorMessageSummary, errorMessageDetail)
                );
                return;
            }

            this.deleteEpisodeRequestData$.subscribe({
                next: () => {
                    this.messageService.add(
                        getMessageObject('success', 'Episode erfolgreich gelöscht')
                    );
                    this.saveEpisode.emit(true);
                },
                error: (err: any) => {
                    if (err.status === 401) {
                        this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                        return;
                    }
                    this.messageService.add(
                        getMessageObject('error', errorMessageSummary, errorMessageDetail)
                    );
                },
            });
        }
    };

    public cancelEpisodeForm = () => {
        this.cancelEpisode.emit(true);
    };

    public setDeletionDialogVisibilityStatus = (status: boolean) => {
        this.isDeletionDialogVisible = status;
    };
}
