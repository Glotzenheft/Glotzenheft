import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { SeasonTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TracklistService } from '../../../service/tracklist/tracklist.service';
import { MediaService } from '../../../service/media/media.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { TRACK_LIST_STATUS_LIST } from '../../../shared/variables/tracklist';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-update-tracklist-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    RatingModule,
  ],
  templateUrl: './update-tracklist-form.component.html',
  styleUrl: './update-tracklist-form.component.css',
})
export class UpdateTracklistFormComponent implements OnInit {
  // input variables
  public inpSeasonTracklists: InputSignal<SeasonTracklist[]> =
    input.required<SeasonTracklist[]>();
  public inpTracklistSelectionForm: InputSignal<FormGroup<any>> =
    input.required<FormGroup<any>>();

  // output variables
  @Output() cancelTracklistEditing: EventEmitter<number> =
    new EventEmitter<number>();

  // other variables
  public updateTracklistForm!: FormGroup;
  public selectedFullTracklist: SeasonTracklist | null = null;
  public isFormSubmitted: boolean = false;
  public tracklistStatusOptions: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((status: string) => ({
      name: status,
      value: status,
    }));

  constructor(
    private formBuilder: FormBuilder,
    private tracklistService: TracklistService,
    private mediaService: MediaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const selectedTracklistFull: SeasonTracklist[] =
      this.inpSeasonTracklists().filter((tracklist: SeasonTracklist) => {
        return (
          tracklist.id ===
          this.inpTracklistSelectionForm().get('selectedTracklist')?.value
            .tracklistId
        );
      });

    if (selectedTracklistFull.length !== 1) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Tracklist-Abruf',
        detail:
          'Es ist ein Fehler aufgetreten. Wir leiten Sie zurück zur Übersicht.',
      });

      this.cancelTracklistEditing.emit(0);
      return;
    }

    this.selectedFullTracklist = selectedTracklistFull[0];
    console.log('tracklist full:', selectedTracklistFull[0]);

    this.updateTracklistForm = this.formBuilder.group({
      tracklist_status: [
        {
          name: selectedTracklistFull[0].status,
          value: selectedTracklistFull[0].status,
        },
        Validators.required,
      ],
      tracklist_name: [
        selectedTracklistFull[0].tracklistName,
        Validators.required,
      ],
      tracklist_rating: [selectedTracklistFull[0].rating],
      tracklist_start_date: [selectedTracklistFull[0].startDate],
      tracklist_finish_date: [selectedTracklistFull[0].finishDate],
    });
  }

  public submitForm = () => {}

  public hasErrorField = (field: string) => {
    const fieldControl = this.updateTracklistForm.get(field);

    return (
      fieldControl! &&
      (fieldControl!.dirty || fieldControl!.touched || this.isFormSubmitted)
    );
  };

  public cancelTracklist = () => {
    this.cancelTracklistEditing.emit(0);
  };
}
