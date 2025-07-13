/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from '../../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import { SeasonTracklist } from '../../../../../app/shared/interfaces/tracklist-interfaces';
import { convertTracklistStatusIntoGerman, TRACK_LIST_STATUS_LIST } from '../../../../../app/shared/variables/tracklist';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UpdateTracklistRequest } from '../../../../../app/shared/interfaces/media-interfaces';
import { UC_GetTracklistUPDATEResponseSubject } from '../../../../../app/core/use-cases/media/get-tracklist-update-response-subject.use-case';
import { UC_GetTracklistDELETEResponseSubject } from '../../../../../app/core/use-cases/media/get-tracklist-delete-response-subject.use-case';
import { UC_TriggerTracklistUPDATESubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-update.subject.use-case';
import { UC_TriggerTracklistDELETESubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-delete-subject.use-case';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-update-film-tracklist',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        MessageModule,
        ButtonModule,
        FloatLabelModule,
        SelectModule,
        RatingModule,
        DatePickerModule,
        DeleteDialogComponent,
    ],
    providers: [
        UC_GetTracklistDELETEResponseSubject,
        UC_GetTracklistUPDATEResponseSubject,
        UC_TriggerTracklistDELETESubject,
        UC_TriggerTracklistUPDATESubject,
        UC_LogoutOfAccount
    ],
    templateUrl: './update-film-tracklist.component.html',
    styleUrl: './update-film-tracklist.component.css',
})
export class UpdateFilmTracklistComponent implements OnInit {
    // input variables
    public inpTracklist: InputSignal<SeasonTracklist> =
        input.required<SeasonTracklist>();

    // output variables
    @Output() cancelTracklistForm: EventEmitter<number> =
        new EventEmitter<number>();
    @Output() refreshFilmPage: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // other variables
    public updateTracklistForm!: FormGroup;
    public isTracklistSubmitted: boolean = false;
    public tracklistStatusOptions: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((status: string) => ({
            name: convertTracklistStatusIntoGerman(status),
            value: status,
        }));

    // variables for requests
    public updateResponseData$: Observable<any> | null = null;
    public deleteTracklistResponseData$: Observable<any> | null = null;

    public isDeleteDialogVisible: boolean = false;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private formBuilder: FormBuilder,
        private getTracklistUPDATEResponseSubjectUseCase: UC_GetTracklistUPDATEResponseSubject,
        private getTracklistDELETEReponseSubjectUseCase: UC_GetTracklistDELETEResponseSubject,
        private triggerTracklistUPDATESubjectUseCase: UC_TriggerTracklistUPDATESubject,
        private triggerTracklistDELETEsubjectUseCase: UC_TriggerTracklistDELETESubject,
        private logoutOfAccountUseCase: UC_LogoutOfAccount
    ) { }

    ngOnInit(): void {
        this.getTracklistUPDATEResponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add({
                    life: 7000,
                    severity: 'success',
                    summary: 'Erfolgreich gespeichert',
                });
                this.refreshFilmPage.emit(true);
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
                        'Bitte probiere es erneut.'
                    )
                );
            },
        });

        this.updateTracklistForm = this.formBuilder.group({
            tracklist_status: [
                {
                    name: convertTracklistStatusIntoGerman(this.inpTracklist().status),
                    value: this.inpTracklist().status,
                },
                Validators.required,
            ],
            tracklist_name: [this.inpTracklist().tracklistName, Validators.required],
            tracklist_rating: [this.inpTracklist().rating],
            tracklist_start_date: [
                this.inpTracklist().startDate !== null
                    ? new Date(this.inpTracklist().startDate!)
                    : null,
            ],
            tracklist_finish_date: [
                this.inpTracklist().finishDate
                    ? new Date(this.inpTracklist().finishDate!)
                    : null,
            ],
        });

        // delete tracklist -------------------------------------------
        this.getTracklistDELETEReponseSubjectUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject('success', 'Trackliste erfolgreich gelöscht')
                );
                this.refreshFilmPage.emit(true);
            },
            error: (err: any) => {
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
                        'Bitte probiere es erneut.'
                    )
                );
            },
        });
    }

    public submitForm = () => {
        this.isTracklistSubmitted = true;

        if (this.updateTracklistForm.invalid) {
            return;
        }

        let formattedStartDate: string = '';
        let formattedEndDate: string = '';

        if (this.updateTracklistForm.get('tracklist_start_date')?.value) {
            formattedStartDate = new Date(
                this.updateTracklistForm.get('tracklist_start_date')?.value
            )
                .toISOString()
                .split('T')[0];
        }

        if (this.updateTracklistForm.get('tracklist_finish_date')?.value) {
            formattedEndDate = new Date(
                this.updateTracklistForm.get('tracklist_finish_date')?.value
            )
                .toISOString()
                .split('T')[0];
        }

        const updateTracklistData: UpdateTracklistRequest = {
            tracklist_id: this.inpTracklist().id,
            tracklist_status:
                this.updateTracklistForm.get('tracklist_status')?.value.value,
            tracklist_name: this.updateTracklistForm.get('tracklist_name')?.value,
            tracklist_rating: this.updateTracklistForm.get('tracklist_rating')?.value,
            tracklist_start_date: formattedStartDate,
            tracklist_finish_date: formattedEndDate,
        };

        this.triggerTracklistUPDATESubjectUseCase.execute(updateTracklistData);
    };

    public hasErrorField = (field: string) => {
        const fieldControl = this.updateTracklistForm.get(field);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isTracklistSubmitted)
        );
    };

    public cancelTracklist = () => {
        this.cancelTracklistForm.emit(0);
    };

    public deleteTracklist = () => {
        this.triggerTracklistDELETEsubjectUseCase.execute(this.inpTracklist().id);
    };

    public setDeleteDialogVisibility = (status: boolean) => {
        this.isDeleteDialogVisible = status;
    };
}
