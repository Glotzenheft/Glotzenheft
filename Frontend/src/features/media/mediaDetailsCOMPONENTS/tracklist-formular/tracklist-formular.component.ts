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
    Input,
    input,
    InputSignal,
    OnInit,
    output,
    OutputEmitterRef,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import {
    convertTracklistStatusIntoGerman,
    TRACK_LIST_STATUS_LIST,
    TracklistStatusType,
} from '../../../../app/shared/variables/tracklist';
import { Message } from 'primeng/message';
import {
    I_TracklistFormOutput,
    SeasonTracklist,
    Tracklist,
} from '../../../../app/shared/interfaces/tracklist-interfaces';
import { DeleteDialogComponent } from '../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';

@Component({
    selector: 'app-tracklist-formular',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        FloatLabelModule,
        DatePickerModule,
        SelectModule,
        RatingModule,
        Checkbox,
        Message,
        DeleteDialogComponent,
    ],
    templateUrl: './tracklist-formular.component.html',
    styleUrl: './tracklist-formular.component.css',
    providers: [],
})
export class TracklistFormularComponent implements OnInit {
    public isTracklistSubmitted: boolean = false;
    public tracklistForm: FormGroup | null = null;
    public tracklistSelectionList: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((selection: string) => ({
            name: convertTracklistStatusIntoGerman(selection),
            value: selection,
        }));
    public isDeleteDialogVisible: boolean = false;

    // input variables
    public inpIsMovie: InputSignal<boolean> = input.required<boolean>();
    public inpIsUpdating: InputSignal<boolean> = input.required<boolean>();
    public inpTracklist: InputSignal<SeasonTracklist> =
        input.required<SeasonTracklist>();

    // output variables
    public outCancelTracklist: OutputEmitterRef<boolean> = output<boolean>();
    public outSubmitTracklist: OutputEmitterRef<I_TracklistFormOutput> =
        output<I_TracklistFormOutput>();
    public outDeleteTracklist: OutputEmitterRef<number> = output<number>();

    constructor(private readonly formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.tracklistForm = this.formBuilder.group({
            trackListName: [
                this.inpTracklist().tracklistName ?? '',
                Validators.required,
            ],
            status: [
                {
                    name: convertTracklistStatusIntoGerman(
                        this.inpTracklist().status,
                    ),
                    value: this.inpTracklist().status,
                },
                Validators.required,
            ],
            startDate: this.inpTracklist().startDate
                ? new Date(this.inpTracklist().startDate!)
                : null,
            finishDate: this.inpTracklist().finishDate
                ? new Date(this.inpTracklist().finishDate!)
                : null,
            rating: this.inpTracklist().rating ?? null,
            isRewatching: this.inpTracklist().isRewatching ?? false,
        });
    }

    public submitTracklist = () => {
        this.isTracklistSubmitted = true;

        if (this.tracklistForm?.invalid) {
            return;
        }

        let formattedStartDate: string = '';
        let formattedEndDate: string = '';
        const formStartDate: string | undefined =
            this.tracklistForm?.get('startDate')?.value;
        const formEndDate: string | undefined =
            this.tracklistForm?.get('finishDate')?.value;

        if (formStartDate) {
            formattedStartDate = new Date(formStartDate)
                .toISOString()
                .split('T')[0];
        }
        if (formEndDate) {
            formattedEndDate = new Date(formEndDate)
                .toISOString()
                .split('T')[0];
        }

        this.outSubmitTracklist.emit({
            id: this.inpTracklist().id,
            status: this.tracklistForm?.get('status')?.value
                .value as TracklistStatusType,
            startDate: formattedStartDate,
            finishDate: formattedEndDate,
            rating: this.tracklistForm?.get('rating')?.value,
            isRewatching: this.tracklistForm?.get('isRewatching')?.value,
            tracklistName: this.tracklistForm?.get('trackListName')?.value,
        });
        this.isTracklistSubmitted = false;
    };

    public onCancelTracklist = () => {
        this.outCancelTracklist.emit(true);
        this.isTracklistSubmitted = false;
    };

    public deleteTracklist = () => {
        this.outDeleteTracklist.emit(this.inpTracklist().id);
        this.isTracklistSubmitted = false;
    };

    public hasErrorField = (field: string) => {
        const fieldControl =
            this.tracklistForm && this.tracklistForm.get(field);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isTracklistSubmitted)
        );
    };
}
