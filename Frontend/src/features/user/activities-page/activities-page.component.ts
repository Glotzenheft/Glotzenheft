import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../service/user/user.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { UserActivity } from '../../../shared/interfaces/user-interfaces';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-activities-page',
  imports: [
    TableModule,
    ButtonModule,
    DateFormattingPipe,
    CommonModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.css',
})
export class ActivitiesPageComponent implements OnInit {
  // variables for user activities overview
  public userActivitiesRequest$: Observable<UserActivity[]> | null = null;
  public userActivitiesRequest: UserActivity[] = [];
  public currentPage: number = 1;
  public isLeftButtonDisabled: boolean = true;
  public isRightButtonDisabled: boolean = false;
  public rightButtonPagesLimit: number | null = null;
  public isRightLimit: boolean = false;

  public isTableLoading: boolean = false;
  public isError: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUserActivities(1);
  }

  // functions --------------------------------------------------
  public loadUserActivities = (page: number) => {
    this.isTableLoading = true;
    this.userActivitiesRequest$ = this.userService.getUserActivities(page);

    if (!this.userActivitiesRequest$) {
      this.isError = true;
      return;
    }

    this.userActivitiesRequest$?.subscribe({
      next: (userActivities: UserActivity[]) => {
        // logic for pagination -------------------------------------------------
        this.currentPage = page;

        // this.currentPage = page;

        if (this.currentPage < 2) {
          this.isLeftButtonDisabled = true;
        }

        if (this.rightButtonPagesLimit) {
          if (this.currentPage < this.rightButtonPagesLimit - 1) {
            this.isRightButtonDisabled = false;
          } else if (this.currentPage < this.rightButtonPagesLimit) {
            this.isRightButtonDisabled = true;
          }
        } else {
          if (userActivities.length < 1 && this.currentPage > 1) {
            // return to previous page if loaded page has no entries
            this.isRightButtonDisabled = true;
            this.currentPage -= 1;
            this.rightButtonPagesLimit = page;
            this.loadUserActivities(this.currentPage);
            return;
          } else if (userActivities.length < 2 && this.currentPage < 2) {
            this.isLeftButtonDisabled = true;
            this.isRightButtonDisabled = true;
          } else if (this.currentPage === 1) {
            this.isRightButtonDisabled = false;
            this.isLeftButtonDisabled = true;
          } else {
            this.isRightButtonDisabled = userActivities.length <= 0;
            this.isLeftButtonDisabled = this.currentPage === 1;
          }
        }
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.messageService.add({
            life: 7000,
            severity: 'error',
            summary: 'Ungültige Anfrage',
            detail:
              'Dein Loginstatus für diesen Account ist abgelaufen. Bitte melde dich erneut an.',
          });

          return;
        }

        this.isError = true;
        this.messageService.add({
          life: 7000,
          severity: 'error',
          summary: 'Fehler beim Laden der Daten',
          detail: 'Es ist ein Fehler aufgetreten. Bitte probiere es erneut.',
        });
      },
    });

    this.isTableLoading = false;
  };

  public changeToNextPage = () => {
    if (this.isRightButtonDisabled) {
      return;
    }
    this.currentPage += 1;
    this.isRightButtonDisabled = false;
    this.isLeftButtonDisabled = false;
    this.loadUserActivities(this.currentPage);
  };

  public changeToPreviousPage = () => {
    if (this.isLeftButtonDisabled) {
      return;
    }

    // this.isRightLimit = false;

    this.currentPage -= 1;
    this.loadUserActivities(this.currentPage);
  };
}
