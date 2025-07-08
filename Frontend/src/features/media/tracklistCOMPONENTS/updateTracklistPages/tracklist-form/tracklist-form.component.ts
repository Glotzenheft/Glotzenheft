import { CommonModule } from '@angular/common';
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
    CommonModule,
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
