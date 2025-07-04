import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { getVisibleRoutes } from '../../../app/shared/variables/routes-list';
import { VisibleRoute } from '../../../app/shared/interfaces/route-list-item';

@Component({
    selector: 'app-footer',
    imports: [CommonModule, ButtonModule, MenuModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
})
export class FooterComponent {
    footerLinkList: { label: string; command: () => void }[] =
        getVisibleRoutes().map((route: VisibleRoute) => {
            return {
                label: route.description,
                command: () => {
                    this.router.navigateByUrl(route.fullUrl);
                },
            };
        });

    constructor(private router: Router) { }

    navigateToRoute = (selectedRoute: string) => {
        this.router.navigateByUrl(selectedRoute);
    };

    @Output() sideBarOpenEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    closeSidebar = () => {
        this.sideBarOpenEvent.emit(false);
    };
}
