import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Tab, TabList, Tabs} from 'primeng/tabs';

@Component({
  selector: 'app-tags-and-groups-tabs',
    imports: [
        Tab,
        TabList,
        Tabs
    ],
  templateUrl: './tags-and-groups-tabs.component.html',
  styleUrl: './tags-and-groups-tabs.component.css'
})
export class TagsAndGroupsTabsComponent implements OnInit{
    public readonly tabs = [
        { route: 'tags', label: 'Tags' },
        { route: 'tag-filter', label: 'Tag Filter' },
        { route: 'groups', label: 'Gruppen'}
    ]

    public currentTab: string = this.tabs[0].route;

    constructor(private router: Router, private route: ActivatedRoute)
    {
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

    public onTabChange(event: string | number) {
        const newTabRoute = event.toString();
        this.currentTab = newTabRoute;
        void this.router.navigate([newTabRoute], { relativeTo: this.route });
    }

    private updateCurrentTabFromUrl(url: string): void {
        const urlSegments = url.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];

        if (this.tabs.some(tab => tab.route === lastSegment)) {
            this.currentTab = lastSegment;
        }
    }
}
