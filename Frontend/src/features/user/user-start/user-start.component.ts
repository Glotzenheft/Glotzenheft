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
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import {
  ERR_OBJECT_INVALID_AUTHENTICATION,
  getMessageObject,
} from '../../../shared/variables/message-vars';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
    TableModule,
    PaginatorModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './user-start.component.html',
  styleUrl: './user-start.component.css',
})
export class UserStartComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public userMediaStatistic$: Observable<WatchTimeStatistic> | null = null;

  public isError: boolean = false;
  public isLoading: boolean = false;

  public lineDiagramData: LineDiagram | null = null;
  public diagramOptions: any;
  public pieChartOptions: any;
  public barChartMediaStatisticOptions: any;
  public barChartYearlyStatisticOptions: any;
  public barChartForMostWatchedDaysMediaStatisticOptions: any;
  public pieChartColors: string[] = [
    '#000000',
    '#32323c',
    '#9c0000',
    '#00009c',
    '#009c00',
    '#9c9c00',
    '#ffff00',
    '#00ff00',
    '#0000ff',
    '#ff0000',
    'rgba(255,255,255,0.5)',
  ];
  public barDiagramData: BarDiagram | null = null;
  public pieChartData: any;
  public barChartForMediaStatistic: BarDiagram | null = null;
  public barChartForYearlyMediaStatistic: BarDiagram | null = null;
  public barChartForMostWatchedDaysMediaStatistic: BarDiagram | null = null;
  public diagramSelection: { name: string; value: number }[] = [
    {
      name: 'Meine Bewertungen (Balkendiagramm)',
      value: 0,
    },
    {
      name: 'Meine Bewertungen (Kreisdiagramm)',
      value: 1,
    },
    {
      name: 'Geschaute Zeit der letzten 30 Tage mit Aktivitäten (Balkendiagramm)',
      value: 2,
    },
    {
      name: 'Geschaute Zeit nach Jahren in Stunden (Balkendiagramm)',
      value: 3,
    },
    {
      name: 'Meistgeschautesten 30 Tage in Minuten (Balkendiagramm)',
      value: 4,
    },
    {
      name: 'Monatlich geschaute Zeit in Stunden (Heatmap)',
      value: 5,
    },
  ];
  public selectedDiagramType: { name: string; value: number } =
    this.diagramSelection[0];
  public chartSelectionCondition: boolean = true;

  // In der Komponenten-Klasse
  public heatmapData: any;
  public years: number[] = [];
  public months: string[] = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ];
  public maxHours: number = 0;

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

    this.isLoading = true;

    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      this.isError = true;
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
            '1 ☆',
            '2 ☆',
            '3 ☆',
            '4 ☆',
            '5 ☆',
            '6 ☆',
            '7 ☆',
            '8 ☆',
            '9 ☆',
            '10 ☆',
          ],
          datasets: [
            {
              label: 'Bewertung',
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
              label: 'Bewertung',
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
          labels: [
            '1 ☆',
            '2 ☆',
            '3 ☆',
            '4 ☆',
            '5 ☆',
            '6 ☆',
            '7 ☆',
            '8 ☆',
            '9 ☆',
            '10 ☆',
            'ohne Bewertung',
          ],
          datasets: [
            {
              label: 'Bewertet',
              data: [
                ...ratingValues,
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
          plugins: {
            legend: {
              position: 'right',
            },
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
              title: { display: true, text: 'Anzahl der Bewertungen' },
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

        this.barChartYearlyStatisticOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: { title: { display: true, text: 'Jahr' } },
            y: {
              title: { display: true, text: 'geschaute Zeit [h]' },
              beginAtZero: true,
              stepSize: 1,
            },
          },
        };

        this.barChartForMostWatchedDaysMediaStatisticOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: { title: { display: true, text: 'Tag' } },
            y: {
              title: { display: true, text: 'geschaute Zeit [min]' },
              beginAtZero: true,
              stepSize: 1,
            },
          },
        };

        this.isLoading = false;
      },
      error: (err: any) => {
        if (err.status === 401) {
          // logout user
          this.userService.logoutOfAccount();
          this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
          this.router.navigateByUrl(`/${ROUTES_LIST[10].fullUrl}`);
          return;
        }

        this.isError = true;
        this.isLoading = false;
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
        const resAsList: [string, number][] = Object.entries(res).slice(1, 31);
        const yearlyDataMap = new Map<string, number>();
        this.prepareHeatmapData(res);

        Object.entries(res).forEach(([date, time]) => {
          if (date !== 'unknown_date') {
            const year = date.split('-')[0]; // Jahr extrahieren
            yearlyDataMap.set(year, (yearlyDataMap.get(year) || 0) + time / 60);
          }
        });

        const yearlyDataList: [string, number][] = Array.from(
          yearlyDataMap.entries()
        );

        // Erstellen des Balkendiagramms
        this.barChartForYearlyMediaStatistic = {
          labels: yearlyDataList.map((val) => val[0]), // Nur die Jahre
          datasets: [
            {
              label: 'Geschaute Zeit pro Jahr [h]',
              data: yearlyDataList.map((val) => val[1]), // Summierte Werte pro Jahr
              fill: true,
              borderColor: '#059669',
              tension: 0.4,
              backgroundColor: '#059669',
            },
          ],
        };

        this.barChartForMediaStatistic = {
          labels: resAsList
            .filter((val: [string, number]) => {
              return val[0] !== 'unknown_date';
            })
            .map((val: [string, number]) =>
              new Date(val[0]).toLocaleDateString()
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

        const mostWatchedDays = Object.entries(res)
          .filter(([date]) => date !== 'unknown_date') // Entferne "unknown_date"
          .sort((a, b) => b[1] - a[1]) // Sortiere nach geschauter Zeit (absteigend)
          .slice(0, 30); // Nimm die Top 30

        this.barChartForMostWatchedDaysMediaStatistic = {
          labels: mostWatchedDays.map(([date]) =>
            new Date(date).toLocaleDateString()
          ),
          datasets: [
            {
              label: 'Geschaute Zeit [min]',
              data: mostWatchedDays.map(([, time]) => time),
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
  };

  private prepareHeatmapData = (statistic: WatchTimeStatistic) => {
    if (this.heatmapData) {
      return;
    }

    const heatmap = new Map<number, number[]>();
    let minYear = Infinity;
    let maxYear = -Infinity;

    // aggregate data
    Object.entries(statistic).forEach(([dateStr, minutes]) => {
      if (dateStr === 'unknown_date') return;

      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth();
      const hours = minutes / 60;

      minYear = Math.min(minYear, year);
      maxYear = Math.max(maxYear, year);

      if (!heatmap.has(year)) {
        heatmap.set(year, new Array(12).fill(0));
      }

      const yearData = heatmap.get(year)!;
      yearData[month] += hours;
    });

    // Fülle Lücken zwischen den Jahren
    this.years = [];
    for (let year = minYear; year <= maxYear; year++) {
      this.years.push(year);
      if (!heatmap.has(year)) {
        heatmap.set(year, new Array(12).fill(0));
      }
    }

    // Berechne Maximum für Farbskala
    this.maxHours = Math.max(
      ...Array.from(heatmap.values())
        .flat()
        .map((h) => Math.ceil(h))
    );

    // Konvertiere für die Anzeige
    this.heatmapData = Array.from(heatmap.entries()).sort(([a], [b]) => b - a); // Neuere Jahre zuerst
  };

  public getHeatmapColor(hours: number, isBackgroundColor: boolean): string {
    if (this.maxHours === 0) return '#ffffff';

    const intensity = Math.sqrt(hours / this.maxHours); // Quadratwurzel für bessere Verteilung
    const colorValue = Math.floor(205 * intensity) + 50; // Werte zwischen 50-255

    if (isBackgroundColor) {
      return `rgb(50, ${colorValue}, 50)`; // Grüner Farbverlauf
    } else {
      // is color of letters
      return colorValue < 200 ? 'white' : 'black';
    }
  }

  public handleDiagramSelectionChange = (e: any) => {
    this.selectedDiagramType = e.value;

    if (e.value.value >= 2) {
      this.loadMediaWatchtimeStatistic();
    } else {
      this.loadTracklistData();
    }
  };

  public navigateToActivitiesPage = () => {
    this.router.navigateByUrl(ROUTES_LIST[14].fullUrl);
  };
}
