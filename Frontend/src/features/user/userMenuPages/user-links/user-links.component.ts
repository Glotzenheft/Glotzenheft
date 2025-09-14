/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {Component, OnDestroy, OnInit} from '@angular/core';
import { VisibleRoute } from '../../../../app/shared/interfaces/route-list-item';
import { getVisibleRoutesForUser } from '../../../../app/shared/variables/routes-list';
import { UC_IsSearchBarVisible } from '../../../../app/core/use-cases/user/get-is-search-bar-visible.use-case';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {NavigationEnd, Router} from "@angular/router";
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-user-links',
    imports: [
        CommonModule,
        MenuModule,
    ],
    standalone: true,
    templateUrl: './user-links.component.html',
    styleUrl: './user-links.component.css',
    providers: [UC_IsSearchBarVisible],
})
export class UserLinksComponent implements OnInit, OnDestroy {
    public isLoggedIn: boolean = false;

    public userMenuItems: MenuItem[] = [];
    private routerSubscription: Subscription | undefined;
    private authSubscription: Subscription | undefined;

    constructor(
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isSearchBarVisibleUseCase
            .observe()
            .subscribe((status: boolean) => {
                this.isLoggedIn = status;
            });

        this.buildMenuItems();

        // Lauscht auf Änderungen der URL und baut das Menü bei Bedarf neu
        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.buildMenuItems();
            });
    }

    ngOnDestroy(): void {
        this.routerSubscription?.unsubscribe();
        this.authSubscription?.unsubscribe();
    }

    private buildMenuItems = (): void => {
        const personalUserLinks: VisibleRoute[] = getVisibleRoutesForUser();

        this.userMenuItems = personalUserLinks.map((route: VisibleRoute): MenuItem => {
            const fullUrl = '/' + route.fullUrl;

            // Prüft, ob der Link des Menüpunkts zur aktuellen URL passt
            const isActive = this.router.isActive(fullUrl, {
                paths: 'exact',
                queryParams: 'exact',
                fragment: 'ignored',
                matrixParams: 'ignored',
            });

            return {
                label: route.description,
                icon: this.getIconForRoute(route.fullUrl),
                routerLink: [fullUrl],
                // FÜGT EINE EIGENE CSS-KLASSE HINZU, WENN DER LINK AKTIV IST
                styleClass: isActive ? 'active-sidebar-menu' : '',
            };
        })
    }


    /**
     * Gibt ein passendes PrimeIcon für eine gegebene Routen-URL zurück.
     * @param url - Die URL der Route.
     * @returns Den CSS-Klassennamen des Icons.
     */
    private getIconForRoute = (url: string): string => {
        switch (url) {
            case 'user':
                return 'pi pi-chart-pie';
            case 'user/tracklists':
                return 'pi pi-list';
            case 'user/activities':
                return 'pi pi-arrow-right-arrow-left';
            case 'user/backup':
                return 'pi pi-database';
            default:
                return 'pi pi-link'; // Fallback-Icon
        }
    }
}
