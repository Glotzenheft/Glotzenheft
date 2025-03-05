import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { MediaService } from '../../../service/media/media.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../service/user/user.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TRACK_LIST_STATUS_LIST } from '../../../shared/variables/tracklist';
import { RatingModule } from 'primeng/rating';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

@Component({
  selector: 'app-create-movie-tracklist',
  imports: [
    CommonModule,
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
      name: selection,
      value: selection,
    }));

  constructor(
    private messageService: MessageService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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

    this.createNewTracklist$ = this.mediaService.createNewMovieTracklist(
      this.tracklistForm.get('trackListName')?.value,
      this.mediaID(),
      this.tracklistForm.get('startDate')?.value,
      this.tracklistForm.get('endDate')?.value,
      this.tracklistForm.get('status')?.value.value,
      this.tracklistForm.get('rating')?.value
    );

    if (!this.createNewTracklist$) {
      this.messageService.add(
        getMessageObject(
          'error',
          'Fehler beim Anlegen der Trackliste',
          'Bitte probiere es erneut nach einem Laden der Seite.'
        )
      );
      return;
    }

    this.createNewTracklist$.subscribe({
      next: (res) => {
        this.messageService.add(
          getMessageObject('success', 'Trackliste erfolgreich angelegt')
        );

        this.saveNewTracklist.emit(0);
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
