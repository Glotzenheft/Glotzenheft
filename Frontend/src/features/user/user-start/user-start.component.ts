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
  public isError: boolean = false;

  public lineDiagramData: LineDiagram | null = null;
  public diagramOptions: any;
  public pieChartOptions: any;
  public pieChartColors: string[] = ['#059669', '#d6e5e4'];
  public barDiagramData: BarDiagram | null = null;
  public pieChartData: any;
  public diagramSelection: { name: string }[] = [
    {
      name: 'Balkendiagramm',
    },
    {
      name: 'Kreisdiagramm',
    },
  ];
  public selectedDiagramType: { name: string } = this.diagramSelection[0];
  public chartSelectionCondition: boolean = true;

  // services

  constructor(
    private mediaService: MediaService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
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
          dataset: [
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

        // this.lineDiagramData = {
        //   labels: ['Januar', 'Februar', 'März', 'April', 'Mai'],
        //   datasets: [
        //     {
        //       label: 'Umsatz',
        //       data: [65, 59, 80, 81, 56],
        //       fill: false,
        //       borderColor: '#42A5F5',
        //       tension: 0.4,
        //     },
        //     {
        //       label: 'Gewinn',
        //       data: [28, 48, 40, 19, 86],
        //       fill: false,
        //       borderColor: '#FFA726',
        //       tension: 0.4,
        //     },
        //   ],
        // };

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
            y: null,
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
              max: 10,
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
  }

  public handleDiagramSelectionChange = (e: any) => {
    this.selectedDiagramType = e.value;

    this.chartSelectionCondition =
      e.value.name === 'Kreisdiagramm' ? false : true;
  };
}
