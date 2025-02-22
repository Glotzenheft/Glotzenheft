import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { CreateNewTracklistComponent } from '../create-new-tracklist/create-new-tracklist.component';
import { TVSeasonWithTracklist } from '../../../shared/interfaces/tracklist-interfaces';

@Component({
  selector: 'app-tracklist-form',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    RatingModule,
    MessageModule,
    CommonModule,
    CreateNewTracklistComponent,
  ],
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

  // output variables
  @Output() cancelTracklistFormSubmission: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(private messageService: MessageService) {}
  ngOnInit(): void {
    console.log('[TRACKLISTFORM] input tv: ', this.inputTVSeason());
  }

  // functions ----------------------
  public cancelTracklistForm = () => {
    this.cancelTracklistFormSubmission.emit(false);
  };
}
