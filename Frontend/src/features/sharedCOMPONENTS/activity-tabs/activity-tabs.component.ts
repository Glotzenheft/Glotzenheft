import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-activity-tabs',
    standalone: true,
    imports: [CommonModule, TabsModule],
    templateUrl: './activity-tabs.component.html',
    styleUrls: ['./activity-tabs.component.css'],
})
export class ActivityTabsComponent implements OnInit {
    public readonly tabs = [
        { route: 'watched', label: 'Geschaut' },
        { route: 'completed', label: 'Abgeschlossen' },
        { route: 'started', label: 'Gestartet' },
    ];

    public currentTab: string = this.tabs[0].route;

    constructor(private router: Router, private route: ActivatedRoute) {
        // Reagiere auf Änderungen in der URL, um den aktiven Tab zu synchronisieren
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe((event: NavigationEnd) => {
                this.updateCurrentTabFromUrl(event.urlAfterRedirects);
            });
    }

    ngOnInit() {
        this.updateCurrentTabFromUrl(this.router.url);
    }

    /**
     * Wird aufgerufen, wenn der Benutzer auf einen Tab klickt.
     * Das Event von p-tabs kann string oder number sein, wir behandeln es als string.
     */
    public onTabChange(event: string | number) {
        const newTabRoute = event.toString();
        this.currentTab = newTabRoute;
        void this.router.navigate([newTabRoute], { relativeTo: this.route });
    }

    /**
     * Extrahiert das letzte Segment aus der URL und setzt den passenden Tab als aktiv.
     */
    private updateCurrentTabFromUrl(url: string): void {
        const urlSegments = url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];

        if (this.tabs.some(tab => tab.route === lastSegment)) {
            this.currentTab = lastSegment;
        }
    }
}