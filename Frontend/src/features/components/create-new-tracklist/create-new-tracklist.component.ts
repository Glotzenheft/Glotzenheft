import { CommonModule } from '@angular/common';
import { Component, input, Input, InputSignal, OnInit } from '@angular/core';
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
import { MediaService } from '../../../service/media/media.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from '../../../service/user/user.service';
import { Observable } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TRACK_LIST_STATUS_LIST } from '../../../shared/variables/tracklist';

@Component({
  selector: 'app-create-new-tracklist',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    MessageModule,
    InputTextModule,
    DialogModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './create-new-tracklist.component.html',
  styleUrl: './create-new-tracklist.component.css',
})
export class CreateNewTracklistComponent implements OnInit {
  // input variables
  public mediaName: InputSignal<string> = input.required<string>();
  public mediaID: InputSignal<number> = input.required<number>();
  public seasonID: InputSignal<number> = input.required<number>();

  // variables for tracklist submitting
  public isTracklistSubmitted: boolean = false;
  public trackListForm!: FormGroup;
  public createNewTracklist$: Observable<any> | null = null;
  public tracklistSelectionList: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((selection: string) => ({
      name: selection,
      value: selection,
    }));

  constructor(
    private messageService: MessageService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.trackListForm = this.formBuilder.group({
      trackListName: [
        `${this.mediaName()} - Staffel ${this.seasonID()}`,
        Validators.required,
      ],
      status: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }

  public createNewTrackList = () => {
    this.isTracklistSubmitted = true;
    if (this.trackListForm.invalid) {
      this.messageService.add({
        life: 7000,
        summary: 'Ungültiger Name',
        detail: 'Der Name der Tracklist darf nicht leer sein.',
        severity: 'error',
      });
    }

    let formattedStartDate: string = '';
    let formattedEndDate: string = '';

    if (this.trackListForm.get('startDate')?.value) {
      formattedStartDate = new Date(this.trackListForm.get('startDate')?.value)
        .toISOString()
        .split('T')[0];

      console.log('start date if:', formattedStartDate);
    }

    if (this.trackListForm.get('endDate')?.value) {
      formattedEndDate = new Date(this.trackListForm.get('endDate')?.value)
        .toISOString()
        .split('T')[0];
      console.log('end date if', formattedEndDate);
    }

    console.log(
      'start date:',
      formattedStartDate,
      'end date:',
      formattedEndDate
    );

    this.createNewTracklist$ = this.mediaService.createNewSeasonTracklist(
      this.trackListForm.get('trackListName')?.value,
      this.mediaID(),
      this.seasonID(),
      formattedStartDate,
      formattedEndDate,
      this.trackListForm.get('status')?.value.name
    );

    if (!this.createNewTracklist$) {
      this.messageService.add({
        life: 7000,
        severity: 'error',
        summary: 'Fehler beim Anlegen der Trackliste',
        detail:
          'Beim Anlegen der Tracklist ist ein Fehler aufgetreten. Bitte lade die Seite neu und versuche es noch einmal.',
      });
      return;
    }

    this.createNewTracklist$.subscribe({
      next: (res) => {
        this.messageService.add({
          life: 7000,
          severity: 'success',
          summary: 'Tracklist erfolgreich angelegt.',
        });
      },
      error: (err) => {
        if (err.status === 401) {
          // status 401 = user is not logged in anymore -> navigate to login page
          this.userService.showNoAccessMessage();
          return;
        }

        this.messageService.add({
          life: 7000,
          summary: 'Fehler beim Anlegen der Trackliste',
          detail:
            'Beim Anlegen der Trackliste ist leider ein Fehler aufgetreten. Bitte laden Sie die Seite und probieren Sie es erneut.',
          severity: 'error',
        });
      },
    });
  };

  public cancelNewTracklist = () => {};

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
