import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../service/user/user.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import {
  UserActivitiesResponse,
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-activities-page',
  imports: [
    TableModule,
    ButtonModule,
    DateFormattingPipe,
    CommonModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    DropdownModule,
    FormsModule,
    Select,
  ],
  templateUrl: './activities-page.component.html',
  styleUrl: './activities-page.component.css',
})
export class ActivitiesPageComponent implements OnInit {
  // variables for user activities overview
  public userActivitiesRequest$: Observable<UserActivitiesResponse> | null = null;
  public userActivitiesListWithDaySplitter: UserActivityWithDaySplitt[] = [];

  public currentPage: number = 1;
  public totalPages: number = 1;
  public totalResults: number = 0;
  public pageOptions: { label: string; value: number }[] = [];
  public isLeftButtonDisabled: boolean = true;
  public isRightButtonDisabled: boolean = false;
  public rightButtonPagesLimit: number | null = null;

  public isTableLoading: boolean = false;
  public isError: boolean = false;
  public serverNotAvailablePage: boolean = false;

  public posterPath: string = TMDB_POSTER_PATH;

  public isLoading: boolean = false;

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
    this.serverNotAvailablePage = false;
    this.isLoading = true;
    this.isTableLoading = true;
    this.userActivitiesRequest$ = this.userService.getUserActivities(page);

    if (!this.userActivitiesRequest$) {
      this.isError = true;
      return;
    }

    this.userActivitiesRequest$.subscribe({
      next: (response) => {
        const userActivities = response.results;
        this.currentPage = response.page;
        this.isLeftButtonDisabled  = this.currentPage === 1;
        this.isRightButtonDisabled = this.currentPage === this.totalPages;
        this.totalPages   = response.total_pages;
        this.totalResults = response.total_results;

        this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => ({
          label: (i + 1).toString(),
          value: i + 1,
        }));

        const sortedUserActivities: UserActivity[] = userActivities.sort(
          (a: UserActivity, b: UserActivity) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
        );

        this.userActivitiesListWithDaySplitter = [];

        const weekDays = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];
        const dailyStats = new Map<
          string,
          { totalRuntime: number; mediaCount: number }
        >();

        sortedUserActivities.forEach((userActivity) => {
          const dateKey = userActivity.date.split(' ')[0];

          if (!dailyStats.has(dateKey)) {
            dailyStats.set(dateKey, { totalRuntime: 0, mediaCount: 0 });
          }

          const stats = dailyStats.get(dateKey)!;
          stats.totalRuntime += userActivity.runtime || 0;
          stats.mediaCount += 1;
        });

        let lastDateKey = '';

        sortedUserActivities.forEach((userActivity) => {
          const dateAsDate = new Date(userActivity.date);
          const formattedDate = dateAsDate.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const weekDay = weekDays[dateAsDate.getDay()];
          const dateKey = userActivity.date.split(' ')[0];

          if (dateKey !== lastDateKey) {
            const stats = dailyStats.get(dateKey)!;

            this.userActivitiesListWithDaySplitter.push({
              date: `${weekDay} ${formattedDate} `,
              episodeID: stats.mediaCount,
              episodeNumber: null,
              mediaID: 0,
              mediaTitle: '',
              posterPath: null,
              runtime: stats.totalRuntime,
              seasonID: null,
              seasonNumber: null,
              stillPath: null,
              tracklistEpisodeID: null,
              tracklistID: -1,
              tracklistName: '',
              tracklistSeasinID: null,
              type: '',
              isDateSplitter: true,
              picture: null
            });

            lastDateKey = dateKey;
          }

          // Füge die eigentliche Aktivität hinzu
          this.userActivitiesListWithDaySplitter.push({
            ...userActivity,
            isDateSplitter: false,
            picture: userActivity.stillPath !== null
              ? userActivity.stillPath
              : userActivity.posterPath
          });
        });

        // logic for pagination -------------------------------------------------
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
        this.isLoading = false;
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);

          return;
        } else if (err.status === 0) {
          this.serverNotAvailablePage = true;
        }

        this.isError = true;
        this.messageService.add(
          getMessageObject(
            'error',
            'Fehler beim Laden der Daten',
            'Bitte probiere es erneut.'
          )
        );

        this.isLoading = false;
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

    this.currentPage -= 1;
    this.loadUserActivities(this.currentPage);
  };

  public onClickActivity = (activity: UserActivityWithDaySplitt) => {
    if (activity.type === 'movie') {
      void this.router.navigateByUrl(`${ROUTES_LIST[5].fullUrl}/${activity.mediaID}`);
    } else {
      void this.router.navigateByUrl(`${ROUTES_LIST[6].fullUrl}/${activity.mediaID}`);
    }
  };

  public onPageSelect = (page: number) => {
    this.loadUserActivities(page);
  };
}
