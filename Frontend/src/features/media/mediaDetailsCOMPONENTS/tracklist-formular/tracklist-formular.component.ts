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
} from '../../../../app/shared/interfaces/tracklist-interfaces';
import { DeleteDialogComponent } from '../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import {TextareaModule} from 'primeng/textarea';
import * as isoLangs from '@cospired/i18n-iso-languages';
import localeDe from '@cospired/i18n-iso-languages/langs/de.json';

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
        TextareaModule,
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

    public languageOptions: any[] = [];

    constructor(private readonly formBuilder: FormBuilder) {
        isoLangs.registerLocale(localeDe);
    }

    ngOnInit(): void {
        const tracklist = this.inpTracklist();
        const season = tracklist.tracklistSeason;

        const allLangs = isoLangs.getNames('de');
        const frequentLangsCodes = ['de', 'en', 'ja', 'ko'];

        const frequentItems = frequentLangsCodes.map(code => ({
            name: allLangs[code],
            code: code,
        }));

        const otherItems = Object.keys(allLangs)
            .filter(code => !frequentLangsCodes.includes(code))
            .map(code => ({
                name: allLangs[code],
                code: code
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        this.languageOptions = [
            {
                groupName: 'Häufig genutzt',
                items: frequentItems
            },
            {
                groupName: 'Alphabetisch',
                items: otherItems
            }
        ];

        this.tracklistForm = this.formBuilder.group({
            trackListName: [tracklist.tracklistName ?? '', Validators.required],
            status: [
                {
                    name: convertTracklistStatusIntoGerman(tracklist.status),
                    value: tracklist.status,
                },
                Validators.required,
            ],
            startDate: tracklist.startDate ? new Date(tracklist.startDate) : null,
            finishDate: tracklist.finishDate ? new Date(tracklist.finishDate) : null,
            rating: tracklist.rating ?? null,
            isRewatching: tracklist.isRewatching ?? false,
            comment: [tracklist.comment ?? null],
            language: [tracklist.language ?? null],
            subtitle: [tracklist.subtitle ?? null],
            customAirDate: [tracklist.customAirDate ? new Date(tracklist.customAirDate) : null],
            customPosterPath: [tracklist.customPosterPath ?? ''],
            // Fields for series
            customSeasonNumber: [season?.customSeasonNumber ?? null],
            customPartNumber: [season?.customPartNumber ?? null],
            startEpisodeNumber: [season?.startEpisodeNumber ?? null],
            endEpisodeNumber: [season?.endEpisodeNumber ?? null],
        });
    }

    public submitTracklist = () => {
        this.isTracklistSubmitted = true;

        if (!this.tracklistForm || this.tracklistForm.invalid) {
            return;
        }

        const formValues = this.tracklistForm.value;

        const formatDateTimeLocal = (dateInput: any): string | null => {
            if (!dateInput) return null;
            const d = new Date(dateInput);
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };

        const formatDateLocal = (dateInput: any): string | null => {
            if (!dateInput) return null;
            const d = new Date(dateInput);
            const pad = (n: number) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        };

        this.outSubmitTracklist.emit({
            id: this.inpTracklist().id,
            tracklistName: formValues.trackListName,
            status: formValues.status.value as TracklistStatusType,
            startDate: formatDateTimeLocal(formValues.startDate),
            createdAt: '',
            tracklistSeason: null,
            updatedAt: null,
            finishDate: formatDateTimeLocal(formValues.finishDate),
            rating: formValues.rating,
            isRewatching: formValues.isRewatching,
            comment: formValues.comment,
            language: formValues.language,
            subtitle: formValues.subtitle,
            customAirDate: formatDateLocal(formValues.customAirDate),
            customPosterPath: formValues.customPosterPath,
            customSeasonNumber: formValues.customSeasonNumber,
            customPartNumber: formValues.customPartNumber,
            startEpisodeNumber: formValues.startEpisodeNumber,
            endEpisodeNumber: formValues.endEpisodeNumber,
            tags: this.inpTracklist().tags || []
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
