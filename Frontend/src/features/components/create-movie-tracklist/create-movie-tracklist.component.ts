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

  // variables for submitting the form
  public isTracklistSubmitted: boolean = false;
  public tracklistForm!: FormGroup;
  public createNewTracklist$: Observable<any> | null = null;

  constructor(
    private messageService: MessageService,
    private mediaService: MediaService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.tracklistForm = this.formBuilder.group({
      trackListName: [this.mediaName(), Validators.required],
      startDate: [new Date(), Validators.required],
    });
  }

  public createNewTracklist = () => {
    this.isTracklistSubmitted = true;

    if (this.tracklistForm.invalid) {
      this.messageService.add({
        life: 7000,
        summary: 'Ungültiger Name',
        detail: 'Der Name der Tracklist darf nicht leer sein.',
        severity: 'error',
      });
    }

    console.log('startdate', this.tracklistForm.get('startDate')?.value);

    this.createNewTracklist$ = this.mediaService.createNewMovieTracklist(
      this.tracklistForm.get('trackListName')?.value,
      this.mediaID(),
      this.tracklistForm.get('startDate')?.value
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
