import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from '../../../../sharedCOMPONENTS/delete-dialog/delete-dialog.component';
import { SeasonTracklist } from '../../../../../shared/interfaces/tracklist-interfaces';
import {
    convertTracklistStatusIntoGerman,
    TRACK_LIST_STATUS_LIST,
} from '../../../../../shared/variables/tracklist';
import { MediaService } from '../../../../../service/media/media.service';
import { UserService } from '../../../../../service/user/user.service';
import { UpdateTracklistRequest } from '../../../../../shared/interfaces/media-interfaces';
import {
    ERR_OBJECT_INVALID_AUTHENTICATION,
    getMessageObject,
} from '../../../../../shared/variables/message-vars';
import { ROUTES_LIST } from '../../../../../shared/variables/routes-list';

@Component({
    selector: 'app-update-film-tracklist',
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        CommonModule,
        MessageModule,
        ButtonModule,
        FloatLabelModule,
        SelectModule,
        RatingModule,
        DatePickerModule,
        DeleteDialogComponent,
    ],
    providers: [MediaService],
    templateUrl: './update-film-tracklist.component.html',
    styleUrl: './update-film-tracklist.component.css',
})
export class UpdateFilmTracklistComponent implements OnInit {
    // input variables
    public inpTracklist: InputSignal<SeasonTracklist> =
        input.required<SeasonTracklist>();

    // output variables
    @Output() cancelTracklistForm: EventEmitter<number> =
        new EventEmitter<number>();
    @Output() refreshFilmPage: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // other variables
    public updateTracklistForm!: FormGroup;
    public isTracklistSubmitted: boolean = false;
    public tracklistStatusOptions: { name: string; value: string }[] =
        TRACK_LIST_STATUS_LIST.map((status: string) => ({
            name: convertTracklistStatusIntoGerman(status),
            value: status,
        }));

    // variables for requests
    public updateResponseData$: Observable<any> | null = null;
    public deleteTracklistResponseData$: Observable<any> | null = null;

    public isDeleteDialogVisible: boolean = false;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private mediaService: MediaService,
        private formBuilder: FormBuilder,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.mediaService.getTracklistUPDATEResponseSubject().subscribe({
            next: () => {
                this.messageService.add({
                    life: 7000,
                    severity: 'success',
                    summary: 'Erfolgreich gespeichert',
                });
                this.refreshFilmPage.emit(true);
            },
            error: (err) => {
                if (err.status === 401) {
                    this.userService.logoutOfAccount();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Speichern',
                        'Bitte probiere es erneut.'
                    )
                );
            },
        });

        this.updateTracklistForm = this.formBuilder.group({
            tracklist_status: [
                {
                    name: convertTracklistStatusIntoGerman(this.inpTracklist().status),
                    value: this.inpTracklist().status,
                },
                Validators.required,
            ],
            tracklist_name: [this.inpTracklist().tracklistName, Validators.required],
            tracklist_rating: [this.inpTracklist().rating],
            tracklist_start_date: [
                this.inpTracklist().startDate !== null
                    ? new Date(this.inpTracklist().startDate!)
                    : null,
            ],
            tracklist_finish_date: [
                this.inpTracklist().finishDate
                    ? new Date(this.inpTracklist().finishDate!)
                    : null,
            ],
        });

        // delete tracklist -------------------------------------------
        this.mediaService.getTracklistDELETEResponseSubject().subscribe({
            next: () => {
                this.messageService.add(
                    getMessageObject('success', 'Trackliste erfolgreich gelöscht')
                );
                this.refreshFilmPage.emit(true);
            },
            error: (err: any) => {
                if (err.status === 401) {
                    this.userService.logoutOfAccount();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    return;
                }
                this.messageService.add(
                    getMessageObject(
                        'error',
                        'Fehler beim Löschen',
                        'Bitte probiere es erneut.'
                    )
                );
            },
        });
    }

    public submitForm = () => {
        this.isTracklistSubmitted = true;

        if (this.updateTracklistForm.invalid) {
            return;
        }

        let formattedStartDate: string = '';
        let formattedEndDate: string = '';

        if (this.updateTracklistForm.get('tracklist_start_date')?.value) {
            formattedStartDate = new Date(
                this.updateTracklistForm.get('tracklist_start_date')?.value
            )
                .toISOString()
                .split('T')[0];
        }

        if (this.updateTracklistForm.get('tracklist_finish_date')?.value) {
            formattedEndDate = new Date(
                this.updateTracklistForm.get('tracklist_finish_date')?.value
            )
                .toISOString()
                .split('T')[0];
        }

        const updateTracklistData: UpdateTracklistRequest = {
            tracklist_id: this.inpTracklist().id,
            tracklist_status:
                this.updateTracklistForm.get('tracklist_status')?.value.value,
            tracklist_name: this.updateTracklistForm.get('tracklist_name')?.value,
            tracklist_rating: this.updateTracklistForm.get('tracklist_rating')?.value,
            tracklist_start_date: formattedStartDate,
            tracklist_finish_date: formattedEndDate,
        };

        this.mediaService.triggerTracklistUPDATESubject(updateTracklistData);
    };

    public hasErrorField = (field: string) => {
        const fieldControl = this.updateTracklistForm.get(field);

        return (
            fieldControl! &&
            (fieldControl!.dirty ||
                fieldControl!.touched ||
                this.isTracklistSubmitted)
        );
    };

    public cancelTracklist = () => {
        this.cancelTracklistForm.emit(0);
    };

    public deleteTracklist = () => {
        this.mediaService.triggerTracklistDELETESubject(this.inpTracklist().id);
    };

    public setDeleteDialogVisibility = (status: boolean) => {
        this.isDeleteDialogVisible = status;
    };
}
