import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterOutlet } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingStatistic, WatchTimeStatistic } from '../../../app/shared/statistic-interfaces';
import { BarDiagram } from '../../../app/shared/interfaces/diagram-interfaces';
import { ERR_OBJECT_INVALID_AUTHENTICATION, getMessageObject } from '../../../app/shared/variables/message-vars';
import { ROUTES_LIST } from '../../../app/shared/variables/routes-list';
import { UC_GetUserRatings } from '../../../app/core/use-cases/user/get-user-ratings.use-case';
import { UC_LogoutOfAccount } from '../../../app/core/use-cases/user/log-out-of-account.use-case';
import { UC_GetUserStatisticWatchTime } from '../../../app/core/use-cases/user/get-user-statistic-watch-time.use-case';

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
    public userMediaStatistic$: Observable<WatchTimeStatistic> | null = null;
    public userRatings$?: Observable<RatingStatistic> | null;

    public isError: boolean = false;
    public isLoading: boolean = false;
    public serverNotAvailablePage: boolean = false;

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
    public ratingBarChart: BarDiagram | null = null;
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
        private messageService: MessageService,
        private router: Router,
        private getUserRatingsUseCase: UC_GetUserRatings,
        private logoutOfAccountUseCase: UC_LogoutOfAccount,
        private getUserStatisticWatchTime: UC_GetUserStatisticWatchTime
    ) { }

    ngOnInit(): void {
        this.loadUserRatings();
    }

    public loadUserRatings = () => {
        this.serverNotAvailablePage = false;

        if (this.userRatings$) {
            // data is already loaded
            return;
        }

        this.isLoading = true;
        this.userRatings$ = this.getUserRatingsUseCase.execute();

        if (!this.userRatings$) {
            this.isError = true;
            return;
        }

        this.userRatings$.subscribe({
            next: (ratingStats: RatingStatistic) => {
                const ratingValues: number[] = [];

                // Erstelle das Array in der richtigen Reihenfolge 1-10
                for (let i = 1; i <= 10; i++) {
                    ratingValues.push(ratingStats[i] || 0);
                }

                const noRatingCount = ratingStats['no_rating'] || 0;

                // create diagram
                this.ratingBarChart = {
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
                            backgroundColor: '#059669',
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
                            data: [...ratingValues, noRatingCount],
                            fill: true,
                            backgroundColor: this.pieChartColors,
                        },
                    ],
                };

                this.pieChartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                    },
                };

                this.diagramOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
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
                    maintainAspectRatio: false,
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
                    maintainAspectRatio: false,
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
                    maintainAspectRatio: false,
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
                    this.logoutOfAccountUseCase.execute();
                    this.messageService.add(ERR_OBJECT_INVALID_AUTHENTICATION);
                    this.router.navigateByUrl(`/${ROUTES_LIST[10].fullUrl}`);
                    return;
                } else if (err.status === 0) {
                    this.serverNotAvailablePage = true;
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

        this.userMediaStatistic$ = this.getUserStatisticWatchTime.execute();

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
                    this.logoutOfAccountUseCase.execute();
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
            return colorValue < 200 ? 'white' : 'black';
        }
    }

    public handleDiagramSelectionChange = (e: any) => {
        this.selectedDiagramType = e.value;

        if (e.value.value >= 2) {
            this.loadMediaWatchtimeStatistic();
        } else {
            this.loadUserRatings();
        }
    };

    public navigateToActivitiesPage = () => {
        this.router.navigateByUrl(ROUTES_LIST[14].fullUrl);
    };
}
