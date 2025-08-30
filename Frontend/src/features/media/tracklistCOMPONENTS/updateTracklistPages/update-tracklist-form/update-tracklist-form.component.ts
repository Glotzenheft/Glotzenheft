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
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { RatingModule } from 'primeng/rating';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import { SeasonTracklist } from '../../../../../app/shared/interfaces/tracklist-interfaces';
import {
    convertTracklistStatusIntoGerman,
    TRACK_LIST_STATUS_LIST,
} from '../../../../../app/shared/variables/tracklist';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UpdateTracklistRequest } from '../../../../../app/shared/interfaces/media-interfaces';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_SetSelectedTracklistInLocalStorage } from '../../../../../app/core/use-cases/tracklist/set-selected-tracklist-in-local-storage.use-case';
import { UC_GetTracklistUPDATEResponseSubject } from '../../../../../app/core/use-cases/media/get-tracklist-update-response-subject.use-case';
import { UC_GetTracklistDELETEResponseSubject } from '../../../../../app/core/use-cases/media/get-tracklist-delete-response-subject.use-case';
import { UC_TriggerTracklistUPDATESubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-update.subject.use-case';
import { UC_TriggerTracklistDELETESubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-delete-subject.use-case';
import {Checkbox} from "primeng/checkbox";

@Component({
    selector: 'app-update-tracklist-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        MessageModule,
        SelectModule,
        FloatLabelModule,
        InputTextModule,
        DatePickerModule,
        RatingModule,
        DeleteDialogComponent,
        Checkbox,
    ],
    providers: [
        UC_GetTracklistDELETEResponseSubject,
        UC_GetTracklistUPDATEResponseSubject,
        UC_TriggerTracklistDELETESubject,
        UC_TriggerTracklistUPDATESubject,
        UC_SetSelectedTracklistInLocalStorage,
        UC_LogoutOfAccount,
    ],
    templateUrl: './update-tracklist-form.component.html',
    styleUrl: './update-tracklist-form.component.css',
})
export class UpdateTracklistFormComponent implements OnInit {
    // input variables

    public inpSelectedTracklist: InputSignal<SeasonTracklist> =
        input.required<SeasonTracklist>();

    // output variables
    @Output() cancelTracklistEditing: EventEmitter<number> =
        new EventEmitter<number>();
    @Output() saveUpdatedTracklist: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // other variables
    public updateTracklistForm!: FormGroup;
    public selectedFullTracklist: SeasonTracklist | null = null;
    public isFormSubmitted: boolean = false;
    public tracklistStatusOptions: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((status: string) => ({
            name: convertTracklistStatusIntoGerman(status),
            value: status,
        }));

    // request variables
    public updateResponseData$: Observable<any> | null = null;
    public deleteResponseData$: Observable<any> | null = null;

    public isDeleteDialogVisible: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        private logoutOfAccountUseCase: UC_LogoutOfAccount,
        private setSelectedTracklistInLocalStorageUseCase: UC_SetSelectedTracklistInLocalStorage,
        private getTracklistUPDATEResponseSubjectUseCase: UC_GetTracklistUPDATEResponseSubject,
        private getTracklistDELETEResponseSubjectUseCase: UC_GetTracklistDELETEResponseSubject,
        private triggerTracklistUPDATESubjectUseCase: UC_TriggerTracklistUPDATESubject,
        private triggerTracklistDELETESubjectUseCase: UC_TriggerTracklistDELETESubject,
    ) {}

    ngOnInit(): void {
        this.getTracklistUPDATEResponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject('success', 'Erfolgreich gespeichert.'),
                );
                this.saveUpdatedTracklist.emit(true);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Speichern',
                        'Bitte probiere es erneut.',
                    ),
                );
            },
        });

        this.getTracklistDELETEResponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject(
                        'success',
                        'Trackliste erfolgreich gelöscht',
                    ),
                );
                this.saveUpdatedTracklist.emit(true);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Löschen',
                        'Bitte probiere es erneut.',
                    ),
                );
            },
        });

        this.loadFilmData();

        // set local storage selected tracklist to this tracklist
        this.setSelectedTracklistInLocalStorageUseCase.execute(
            this.inpSelectedTracklist().id,
        );
    }

    public loadFilmData = () => {
        this.selectedFullTracklist = this.inpSelectedTracklist();

        this.updateTracklistForm = this.formBuilder.group({
            tracklist_status: [
                {
                    name: convertTracklistStatusIntoGerman(
                        this.inpSelectedTracklist().status,
                    ),
                    value: this.inpSelectedTracklist().status,
                },
                Validators.required,
            ],
            tracklist_name: [
                this.inpSelectedTracklist().tracklistName,
                Validators.required,
            ],
            tracklist_rating: [this.inpSelectedTracklist().rating],
            tracklist_start_date: [
                this.inpSelectedTracklist().startDate
                    ? new Date(this.inpSelectedTracklist().startDate!)
                    : null,
            ],
            tracklist_finish_date: [
                this.inpSelectedTracklist().finishDate
                    ? new Date(this.inpSelectedTracklist().finishDate!)
                    : null,
            ],
            is_rewatching: [this.inpSelectedTracklist().isRewatching],
        });
    };

    public submitForm = () => {
        this.isFormSubmitted = true;

        if (this.updateTracklistForm.invalid) {
            return;
        }

        if (!this.selectedFullTracklist) {
            return;
        }

        let formattedStartDate: string = '';
        let formattedEndDate: string = '';

        if (this.updateTracklistForm.get('tracklist_start_date')?.value) {
            formattedStartDate = new Date(
                this.updateTracklistForm.get('tracklist_start_date')?.value,
            )
                .toISOString()
                .split('T')[0];
        }

        if (this.updateTracklistForm.get('tracklist_finish_date')?.value) {
            formattedEndDate = new Date(
                this.updateTracklistForm.get('tracklist_finish_date')?.value,
            )
                .toISOString()
                .split('T')[0];
        }

        const updateTracklistData: UpdateTracklistRequest = {
            tracklist_id: this.selectedFullTracklist.id,
            tracklist_status:
                this.updateTracklistForm.get('tracklist_status')?.value.value,
            tracklist_name:
                this.updateTracklistForm.get('tracklist_name')?.value,
            tracklist_rating:
                this.updateTracklistForm.get('tracklist_rating')?.value,
            tracklist_start_date: formattedStartDate,
            tracklist_finish_date: formattedEndDate,
            is_rewatching: this.updateTracklistForm.get('is_rewatching')?.value,
        };

        this.triggerTracklistUPDATESubjectUseCase.execute(updateTracklistData);
    };

    public hasErrorField = (field: string) => {
        const fieldControl = this.updateTracklistForm.get(field);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isFormSubmitted)
        );
    };

    public cancelTracklist = () => {
        this.cancelTracklistEditing.emit(0);
    };

    public deleteTracklist = () => {
        this.isDeleteDialogVisible = false;

        this.triggerTracklistDELETESubjectUseCase.execute(
            this.inpSelectedTracklist().id,
        );
    };

    public setDeleteDialogVisibility = (status: boolean) => {
        this.isDeleteDialogVisible = status;
    };
}
