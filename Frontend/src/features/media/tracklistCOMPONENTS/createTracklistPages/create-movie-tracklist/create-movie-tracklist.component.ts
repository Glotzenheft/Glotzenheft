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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import {
    Component,
    EventEmitter,
    input,
    InputSignal,
    OnInit,
    Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { Router } from '@angular/router';
import { convertTracklistStatusIntoGerman, TRACK_LIST_STATUS_LIST } from '../../../../../app/shared/variables/tracklist';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../app/shared/variables/routes-list';
import { UC_getTracklistCREATEMOVIESubjectResponse } from '../../../../../app/core/use-cases/media/get-tracklist-create-movie-subject-response.use-case';
import { UC_TriggerTracklistCREATEMOVIESubject } from '../../../../../app/core/use-cases/media/trigger-tracklist-create-movie-subject.use-case';
import { UC_LogoutOfAccount } from '../../../../../app/core/use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-create-movie-tracklist',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        MessageModule,
        InputTextModule,
        FloatLabelModule,
        DialogModule,
        DatePickerModule,
        SelectModule,
        RatingModule,
    ],
    providers: [UC_getTracklistCREATEMOVIESubjectResponse, UC_TriggerTracklistCREATEMOVIESubject, UC_LogoutOfAccount],
    templateUrl: './create-movie-tracklist.component.html',
    styleUrl: './create-movie-tracklist.component.css',
})
export class CreateMovieTracklistComponent implements OnInit {
    // input variables
    public mediaName: InputSignal<string> = input.required<string>();
    public mediaID: InputSignal<number> = input.required<number>();

    // output variables
    @Output() cancelTracklistCreation: EventEmitter<boolean> =
        new EventEmitter<boolean>(false);
    @Output() saveNewTracklist: EventEmitter<number> = new EventEmitter<number>();

    // variables for submitting the form
    public isTracklistSubmitted: boolean = false;
    public tracklistForm!: FormGroup;
    public createNewTracklist$: Observable<any> | null = null;
    public tracklistSelectionList: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((selection: string) => ({
            name: convertTracklistStatusIntoGerman(selection),
            value: selection,
        }));

    constructor(
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private router: Router,
        private getTracklistCREATEMOVIESubjectResponseUseCase: UC_getTracklistCREATEMOVIESubjectResponse,
        private triggerTracklistCREATEMOVIESubjectUseCase: UC_TriggerTracklistCREATEMOVIESubject,
        private logoutOfAccountUseCase: UC_LogoutOfAccount
    ) { }

    ngOnInit(): void {
        this.getTracklistCREATEMOVIESubjectResponseUseCase.execute().subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject('success', 'Trackliste erfolgreich angelegt')
                );
                this.saveNewTracklist.emit(0);
            },
            error: (err) => {
                if (err.status === 401) {
                    // status 401 = user is not logged in anymore -> navigate to login page
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Anlegen der Trackliste',
                        'Bitte lade die Seite neu und probiere es erneut.'
                    )
                );
            },
        });

        this.tracklistForm = this.formBuilder.group({
            trackListName: [this.mediaName().toString(), [Validators.required]],
            startDate: [null],
            endDate: [null],
            status: ['', Validators.required],
            rating: [null],
        });
    }

    public createNewTracklist = () => {
        this.isTracklistSubmitted = true;

        if (this.tracklistForm.invalid) {
            return;
        }

        this.triggerTracklistCREATEMOVIESubjectUseCase.execute({
            name: this.tracklistForm.get('trackListName')?.value,
            mediaID: this.mediaID(),
            startDate: this.tracklistForm.get('startDate')?.value,
            endDate: this.tracklistForm.get('endDate')?.value,
            status: this.tracklistForm.get('status')?.value.value,
            rating: this.tracklistForm.get('rating')?.value,
        });
    };

    public hasErrorField = (fieldName: string): boolean => {
        const fieldControl = this.tracklistForm.get(fieldName);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isTracklistSubmitted)
        );
    };

    public cancelNewTracklist = () => {
        this.cancelTracklistCreation.emit(false);
    };
}
