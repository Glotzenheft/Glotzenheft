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
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { TVSeasonWithTracklist } from '../../../../../app/shared/interfaces/tracklist-interfaces';
import { CreateNewTracklistComponent } from "../../createTracklistPages/create-new-tracklist/create-new-tracklist.component";

@Component({
    selector: 'app-tracklist-form',
    imports: [
        ReactiveFormsModule,
        ButtonModule,
        RatingModule,
        MessageModule,
        CreateNewTracklistComponent
    ],
    providers: [],
    templateUrl: './tracklist-form.component.html',
    styleUrl: './tracklist-form.component.css',
})
export class TracklistFormComponent implements OnInit {
    // input variables
    public isNewTracklistForm: InputSignal<boolean> = input.required<boolean>();
    public inputTVSeason: InputSignal<TVSeasonWithTracklist> =
        input.required<TVSeasonWithTracklist>();
    public isNewTracklistOfTypeTV: InputSignal<boolean> =
        input.required<boolean>();
    public mediaID: InputSignal<number> = input.required<number>();
    public inpTVName: InputSignal<string> = input.required<string>();

    // output variables
    @Output() cancelTracklistFormSubmission: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output() saveNewTracklist: EventEmitter<boolean> =
        new EventEmitter<boolean>();


    ngOnInit(): void { }

    // functions ----------------------
    public saveNewUpdatedTracklist = () => {
        this.saveNewTracklist.emit(true);
    };
    public cancelTracklistForm = () => {
        this.cancelTracklistFormSubmission.emit(false);
    };
}
