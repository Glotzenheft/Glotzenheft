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
  ],
  templateUrl: './create-new-tracklist.component.html',
  styleUrl: './create-new-tracklist.component.css',
})
export class CreateNewTracklistComponent implements OnInit {
  public mediaName: InputSignal<string> = input.required<string>();
  public mediaID: InputSignal<number> = input.required<number>();
  public seasonID: InputSignal<number> = input.required<number>();

  public isTracklistSubmitted: boolean = false;
  public trackListForm!: FormGroup;
  public createNewTracklist$: Observable<any> | null = null;

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
    });
  }

  public createNewTrackList = (id: number, name: string) => {
    this.isTracklistSubmitted = true;
    if (this.trackListForm.invalid) {
      this.messageService.add({
        life: 7000,
        summary: 'Ungültiger Name',
        detail: 'Der Name der Tracklist darf nicht leer sein.',
        severity: 'error',
      });
    }

    this.createNewTracklist$ = this.mediaService.createNewSeasonTracklist(
      this.trackListForm.get('trackListName')?.value,
      this.mediaID(),
      this.seasonID()
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
      next: (res) => {},
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
