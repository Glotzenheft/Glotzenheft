import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterOutlet } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { Tracklist } from '../../../shared/interfaces/tracklist-interfaces';
import { MediaService } from '../../../service/media/media.service';
import { MessageService } from 'primeng/api';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { UserService } from '../../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import {
  BarDiagram,
  LineDiagram,
} from '../../../shared/interfaces/diagram-interfaces';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { WatchTimeStatistic } from '../../../shared/statistic-interfaces';

@Component({
  selector: 'app-user-start',
  imports: [
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    RouterOutlet,
    PanelModule,
    CommonModule,
    ChartModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './user-start.component.html',
  styleUrl: './user-start.component.css',
})
export class UserStartComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public userMediaStatistic$: Observable<WatchTimeStatistic> | null = null;

  public isError: boolean = false;

  public lineDiagramData: LineDiagram | null = null;
  public diagramOptions: any;
  public pieChartOptions: any;
  public barChartMediaStatisticOptions: any;
  public pieChartColors: string[] = ['#059669', '#d6e5e4'];
  public barDiagramData: BarDiagram | null = null;
  public pieChartData: any;
  public barChartForMediaStatistic: BarDiagram | null = null;
  public diagramSelection: { name: string; value: number }[] = [
    {
      name: 'Meine Tracklistenratings (Balkendiagramm)',
      value: 0,
    },
    {
      name: 'Meine Tracklistenratings (Kreisdiagramm)',
      value: 1,
    },
    {
      name: 'Medien pro Tag (Balkendiagramm)',
      value: 2,
    },
  ];
  public selectedDiagramType: { name: string; value: number } =
    this.diagramSelection[0];
  public chartSelectionCondition: boolean = true;

  // services

  constructor(
    private mediaService: MediaService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTracklistData();
  }

  public loadTracklistData = () => {
    if (this.userTracklists$) {
      // data is already loaded
      return;
    }

    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      this.isError;
      return;
    }

    this.userTracklists$.subscribe({
      next: (res: Tracklist[]) => {
        const filteredTracklists: Tracklist[] = res.filter(
          (tracklist: Tracklist) => tracklist.rating !== null
        );

        const ratingValues: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (const tracklist of filteredTracklists) {
          ratingValues[tracklist.rating! - 1] += 1;
        }

        // create diagram
        this.lineDiagramData = {
          labels: [
            '1 / 10',
            '2 / 10',
            '3 / 10',
            '4 / 10',
            '5 / 10',
            '6 / 10',
            '7 / 10',
            '8 / 10',
            '9 / 10',
            '10 / 10',
          ],
          datasets: [
            {
              label: 'Rating',
              data: ratingValues,
              fill: true,
              borderColor: '#059669',
              tension: 0.4,
              hoverBackgroundColor: '#059669',
              backgroundColor: '#059669',
            },
          ],
        };

        this.barDiagramData = {
          labels: filteredTracklists.map((tracklist: Tracklist) => {
            return tracklist.tracklistName;
          }),
          datasets: [
            {
              label: 'Rating',
              data: filteredTracklists.map((tracklist: Tracklist) =>
                tracklist.rating !== null ? tracklist.rating : 1
              ),
              backgroundColor: '#059669',
              borderColor: '#059669',
              fill: true,
              tension: 0.4,
            },
          ],
        };

        this.pieChartData = {
          labels: ['mit Bewertung', 'ohne Bewertung'],
          datasets: [
            {
              label: 'Bewertet',
              data: [
                filteredTracklists.length,
                res.filter((tracklist: Tracklist) => tracklist.rating === null)
                  .length,
              ],
              fill: true,
              backgroundColor: this.pieChartColors,
            },
          ],
        };

        this.pieChartOptions = {
          responsive: true,
          scales: {
            x: { title: { display: true, text: 'Bewertung' } },
          },
        };

        this.diagramOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: { title: { display: true, text: 'Bewertung' } },
            y: {
              title: { display: true, text: 'Anzahl der Tracklisten' },
              beginAtZero: true,
              stepSize: 1,
            },
          },
        };

        this.barChartMediaStatisticOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: { title: { display: true, text: 'Datum (geschaut)' } },
            y: {
              title: { display: true, text: 'geschaute Zeit [min]' },
              beginAtZero: true,
              stepSize: 1,
            },
          },
        };
      },
      error: (err: any) => {
        if (err.status === 401) {
          this.messageService.add({
            life: 7000,
            severity: 'error',
            summary: 'Ungültige Authentifizierung',
            detail: 'Deine Authentifizierungsdaten sind ungültig.',
          });

          this.userService.logoutOfAccount();

          // navigate to login page
          this.router.navigateByUrl(`/${ROUTES_LIST[1].fullUrl}`);
          return;
        }

        this.isError = true;
      },
    });
  };

  public loadMediaWatchtimeStatistic = () => {
    if (this.userMediaStatistic$) {
      // do not request if the data is already loaded
      return;
    }

    this.userMediaStatistic$ = this.userService.getUserStatisticWatchTime();

    if (!this.userMediaStatistic$) {
      this.isError = true;
      return;
    }

    this.userMediaStatistic$.subscribe({
      next: (res: WatchTimeStatistic) => {
        const resAsList: [string, number][] = Object.entries(res).slice(0, 4);

        this.barChartForMediaStatistic = {
          labels: resAsList.map((val: [string, number]) =>
            val[0] === 'unknown_date'
              ? 'unbekanntes Datum'
              : new Date(val[0]).toLocaleDateString()
          ),
          datasets: [
            {
              label: 'geschaute Zeit [min]',
              data: resAsList.map((val: [string, number]) => val[1]),
              fill: true,
              borderColor: '#059669',
              tension: 0.4,
              backgroundColor: '#059669',
            },
          ],
        };
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
  };

  public handleDiagramSelectionChange = (e: any) => {
    this.selectedDiagramType = e.value;

    if (e.value.value === 2) {
      this.loadMediaWatchtimeStatistic();
    } else {
      this.loadTracklistData();
    }
  };
}
