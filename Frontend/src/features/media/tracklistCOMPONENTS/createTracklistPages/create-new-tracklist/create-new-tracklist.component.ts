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
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { Router } from '@angular/router';
import {
    Tracklist,
    TVSeasonWithTracklist,
} from '../../../../../app/shared/interfaces/tracklist-interfaces';
import {
    convertTracklistStatusIntoGerman,
    TRACK_LIST_STATUS_LIST,
} from '../../../../../app/shared/variables/tracklist';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UC_GetTracklistCREATESEASONResponseSubject } from '../../../../../app/core/use-cases/media/get-tracklist-create-season-response-subject.use-case';
import { UC_TriggerTracklistCREATESEASONSubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-create-season-subject.use-case';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_SetSelectedTracklistInLocalStorage } from '../../../../../app/core/use-cases/tracklist/set-selected-tracklist-in-local-storage.use-case';
import {Checkbox} from "primeng/checkbox";

@Component({
    selector: 'app-create-new-tracklist',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        MessageModule,
        InputTextModule,
        DialogModule,
        FloatLabelModule,
        DatePickerModule,
        SelectModule,
        RatingModule,
        Checkbox,
    ],
    providers: [
        UC_GetTracklistCREATESEASONResponseSubject,
        UC_TriggerTracklistCREATESEASONSubject,
        UC_SetSelectedTracklistInLocalStorage,
        UC_LogoutOfAccount,
    ],
    templateUrl: './create-new-tracklist.component.html',
    styleUrl: './create-new-tracklist.component.css',
})
export class CreateNewTracklistComponent implements OnInit {
    // input variables
    public mediaID: InputSignal<number> = input.required<number>();
    public inputSeason: InputSignal<TVSeasonWithTracklist> =
        input.required<TVSeasonWithTracklist>();
    public inpTVName: InputSignal<string> = input.required<string>();

    // output variables
    @Output() cancelTracklistForm: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() saveUpdatedTracklist: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // variables for tracklist submitting
    public isTracklistSubmitted: boolean = false;
    public trackListForm!: FormGroup;
    public tracklistSelectionList: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((selection: string) => ({
            name: convertTracklistStatusIntoGerman(selection),
            value: selection,
        }));

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router,
        private getTracklistCREATESEASONResponseSubjectUseCase: UC_GetTracklistCREATESEASONResponseSubject,
        private triggerTracklistCREATESEASONSubjectUseCase: UC_TriggerTracklistCREATESEASONSubject,
        private logoutOfAccountUseCase: UC_LogoutOfAccount,
        private setSelectedTracklistInLocalStorageUseCase: UC_SetSelectedTracklistInLocalStorage,
    ) {}

    ngOnInit(): void {
        this.getTracklistCREATESEASONResponseSubjectUseCase
            .execute()
            .subscribe({
                next: (res: Tracklist) => {
                    this.messageService.add(
                        getMessageObject(
                            'success',
                            'Tracklist erfolgreich angelegt',
                        ),
                    );
                    // set current tracklist to local storage
                    this.setSelectedTracklistInLocalStorageUseCase.execute(
                        res.id,
                    );
                    this.saveUpdatedTracklist.emit(true);
                },
                error: (err) => {
                    if (err.status === 401) {
                        // status 401 = user is not logged in anymore -> navigate to login page
                        this.logoutOfAccountUseCase.execute();
                        this.messageService.add(
                            ERR_OBJECT_INVALID_AUTHENTICATION,
                        );
                        void this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Anlegen der Trackliste',
                        'Bitte lade die Seite neu und probiere es erneut.',
                        ),
                    );
                },
            });

        this.trackListForm = this.formBuilder.group({
            trackListName: [
                `${this.inpTVName()} - Staffel ${this.inputSeason().seasonNumber}`,
                Validators.required,
            ],
            status: ['', Validators.required],
            startDate: [''],
            endDate: [''],
            rating: [null],
            isRewatching: [false],
        });
    }

    public createNewTrackList = () => {
        this.isTracklistSubmitted = true;
        if (this.trackListForm.invalid) {
            return;
        }

        let formattedStartDate: string = '';
        let formattedEndDate: string = '';

        if (this.trackListForm.get('startDate')?.value) {
            formattedStartDate = new Date(
                this.trackListForm.get('startDate')?.value,
            )
                .toISOString()
                .split('T')[0];
        }

        if (this.trackListForm.get('endDate')?.value) {
            formattedEndDate = new Date(
                this.trackListForm.get('endDate')?.value,
            )
                .toISOString()
                .split('T')[0];
        }

        this.triggerTracklistCREATESEASONSubjectUseCase.execute({
            tracklist_name: this.trackListForm.get('trackListName')?.value,
            media_id: this.mediaID(),
            season_id: this.inputSeason().id,
            tracklist_start_date: formattedStartDate,
            tracklist_finish_date: formattedEndDate,
            tracklist_status: this.trackListForm.get('status')?.value.value,
            tracklist_rating: this.trackListForm.get('rating')?.value,
            is_rewatching: this.trackListForm.get('isRewatching')?.value,
            media_type: 'tv',
        });
    };

    public cancelNewTracklist = () => {
        this.cancelTracklistForm.emit(false);
    };

    public hasErrorField = (field: string) => {
        const fieldControl = this.trackListForm.get(field);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isTracklistSubmitted)
        );
    };
}
