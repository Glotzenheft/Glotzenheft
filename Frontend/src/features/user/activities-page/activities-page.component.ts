import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../service/user/user.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  UserActivity,
  UserActivityWithDaySplitt,
} from '../../../shared/interfaces/user-interfaces';
import { DateFormattingPipe } from '../../../pipes/date-formatting/date-formatting.pipe';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TMDB_POSTER_PATH } from '../../../shared/variables/tmdb-vars';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

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
  public userActivitiesListWithDaySplitter: UserActivityWithDaySplitt[] = [];

  public currentPage: number = 1;
  public isLeftButtonDisabled: boolean = true;
  public isRightButtonDisabled: boolean = false;
  public rightButtonPagesLimit: number | null = null;
  public isRightLimit: boolean = false;

  public isTableLoading: boolean = false;
  public isError: boolean = false;

  public posterPath: string = TMDB_POSTER_PATH;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
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
        let index: number = 0;
        const sortedUserActivities: UserActivity[] = userActivities.sort(
          (a: UserActivity, b: UserActivity) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        );

        this.userActivitiesListWithDaySplitter = [];

        for (const userActivity of sortedUserActivities) {
          if (index === 0) {
            const dateAsDate: Date = new Date(userActivities[0].date);
            let weekDay: string = '';

            switch (dateAsDate.getDay()) {
              case 0:
                weekDay = 'Sonntag';
                break;
              case 1:
                weekDay = 'Montag';
                break;
              case 2:
                weekDay = 'Dienstag';
                break;
              case 3:
                weekDay = 'Mittwoch';
                break;
              case 4:
                weekDay = 'Donnerstag';
                break;
              case 5:
                weekDay = 'Freitag';
                break;
              case 6:
                weekDay = 'Samstag';
                break;
            }

            this.userActivitiesListWithDaySplitter.push({
              date: userActivity.date,
              episodeID: null,
              episodeNumber: null,
              mediaID: 0,
              mediaTitle: '',
              posterPath: null,
              seasonID: null,
              seasonNumber: null,
              stillPath: null,
              tracklistEpisodeID: null,
              tracklistID: -1,
              tracklistName:
                'Tag: ' + dateAsDate.toLocaleDateString() + ` (${weekDay})`,
              tracklistSeasinID: null,
              type: '',
              isDateSplitter: true,
            });
          }

          if (
            index > 0 &&
            sortedUserActivities[index - 1].date.split(' ')[0] !==
              userActivity.date.split(' ')[0]
          ) {
            const dateAsDate: Date = new Date(userActivity.date);
            let weekDay: string = '';

            switch (dateAsDate.getDay()) {
              case 0:
                weekDay = 'Sonntag';
                break;
              case 1:
                weekDay = 'Montag';
                break;
              case 2:
                weekDay = 'Dienstag';
                break;
              case 3:
                weekDay = 'Mittwoch';
                break;
              case 4:
                weekDay = 'Donnerstag';
                break;
              case 5:
                weekDay = 'Freitag';
                break;
              case 6:
                weekDay = 'Samstag';
                break;
            }

            this.userActivitiesListWithDaySplitter.push({
              date: userActivity.date,
              episodeID: null,
              episodeNumber: null,
              mediaID: 0,
              mediaTitle: '',
              posterPath: null,
              seasonID: null,
              seasonNumber: null,
              stillPath: null,
              tracklistEpisodeID: null,
              tracklistID: -1,
              tracklistName:
                'Tag: ' + dateAsDate.toLocaleDateString() + ` (${weekDay})`,
              tracklistSeasinID: null,
              type: '',
              isDateSplitter: true,
            });
          }
          this.userActivitiesListWithDaySplitter.push({
            ...userActivity,
            isDateSplitter: false,
          });

          index++;
        }

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
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);

          return;
        }

        this.isError = true;
        this.messageService.add(
          getMessageObject(
            'error',
            'Fehler beim Laden der Daten',
            'Bitte probiere es erneut.'
          )
        );
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

  public getPicture = (currentActivity: UserActivity): string | null => {
    if (!currentActivity.stillPath && !currentActivity.posterPath) {
      return null;
    }

    if (currentActivity.type === 'movie') {
      return currentActivity.posterPath;
    } else {
      return currentActivity.stillPath;
    }
  };

  public onClickActivity = (activity: UserActivityWithDaySplitt) => {
    if (activity.type === 'movie') {
      this.router.navigateByUrl(
        `${ROUTES_LIST[5].fullUrl}/${activity.mediaID}`
      );
      return;
    }

    this.router.navigateByUrl(`${ROUTES_LIST[6].fullUrl}/${activity.mediaID}`);
  };
}
