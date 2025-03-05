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
import {
  convertTracklistStatusIntoGerman,
  TRACK_LIST_STATUS_LIST,
} from '../../../shared/variables/tracklist';
import { TVSeasonWithTracklist } from '../../../shared/interfaces/tracklist-interfaces';
import { RatingModule } from 'primeng/rating';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

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
    RatingModule,
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
  public createNewTracklist$: Observable<any> | null = null;
  public tracklistSelectionList: { name: string; value: string }[] =
    TRACK_LIST_STATUS_LIST.map((selection: string) => ({
      name: convertTracklistStatusIntoGerman(selection),
      value: selection,
    }));

  // other variables
  public convertStatus = convertTracklistStatusIntoGerman;

  constructor(
    private messageService: MessageService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.trackListForm = this.formBuilder.group({
      trackListName: [
        `${this.inpTVName()} - Staffel ${this.inputSeason().seasonNumber}`,
        Validators.required,
      ],
      status: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      rating: [null],
    });
    console.log('season id', this.inputSeason().id);
  }

  public createNewTrackList = () => {
    this.isTracklistSubmitted = true;
    if (this.trackListForm.invalid) {
      return;
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

    this.createNewTracklist$ = this.mediaService.createNewSeasonTracklist(
      this.trackListForm.get('trackListName')?.value,
      this.mediaID(),
      this.inputSeason().id,
      formattedStartDate,
      formattedEndDate,
      this.trackListForm.get('status')?.value.value,
      this.trackListForm.get('rating')?.value
    );

    if (!this.createNewTracklist$) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Fehler beim Anlegen der Trackliste',
          'Bitte lade die Seite neu und versuche es noch einmal.'
        )
      );
      return;
    }

    this.createNewTracklist$.subscribe({
      next: (res) => {
        this.messageService.add(
          getMessageObject('success', 'Tracklist erfolgreich angelegt')
        );

        this.saveUpdatedTracklist.emit(true);
      },
      error: (err) => {
        if (err.status === 401) {
          // status 401 = user is not logged in anymore -> navigate to login page
          this.userService.logoutOfAccount();
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
