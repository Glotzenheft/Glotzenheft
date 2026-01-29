import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

import {
    SIDEBAR_MAIN_MENU,
    SIDEBAR_LEGAL_MENU,
    SIDEBAR_OPTION_MENU,
    SIDEBAR_GUEST_MENU,
} from './sidebar.constants';
import { SidebarMenuItem } from '../../models/sidebar.models';
import { UC_IsSearchBarVisible } from '../../use-cases/user/get-is-search-bar-visible.use-case';
import { UC_LogoutOfAccount } from '../../use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, MenuModule, TooltipModule],
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    providers: [UC_IsSearchBarVisible, UC_LogoutOfAccount],
})
export class SidebarComponent implements OnInit, OnDestroy {
    public isLoggedIn: boolean = false;
    public isSidebarOpen: boolean = window.innerWidth > 850;

    public mainMenuItems: MenuItem[] = [];
    public optionsPopupItems: MenuItem[] = [];
    public footerMenuItems: MenuItem[] = [];
    public collapsedMainMenuItems: MenuItem[] = [];

    private routerSubscription: Subscription | undefined;
    private authSubscription: Subscription | undefined;

    constructor(
        private router: Router,
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible,
        private logoutUseCase: UC_LogoutOfAccount,
    ) {}

    ngOnInit() {
        this.authSubscription = this.isSearchBarVisibleUseCase
            .observe()
            .subscribe((status: boolean) => {
                this.isLoggedIn = status;
                this.rebuildMenuItems();
            });

        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.rebuildMenuItems();
            });

        this.rebuildMenuItems();
    }

    ngOnDestroy() {
        this.routerSubscription?.unsubscribe();
        this.authSubscription?.unsubscribe();
    }

    public setSidebarOpen(newValue: boolean): void {
        this.isSidebarOpen = newValue;
    }

    private rebuildMenuItems = (): void => {
        const mainSource = this.isLoggedIn ? SIDEBAR_MAIN_MENU : SIDEBAR_GUEST_MENU;

        this.mainMenuItems = this.mapSidebarItems(mainSource);
        this.collapsedMainMenuItems = this.mapSidebarItems(mainSource, true);

        this.optionsPopupItems = this.isLoggedIn
            ? SIDEBAR_OPTION_MENU.map((item) =>
                item.action === 'logout'
                    ? {
                        label: item.label,
                        icon: item.icon,
                        command: () => {
                            this.logoutUseCase.execute();
                        },
                    }
                    : this.mapItemToPrimeNg(item),
            )
            : this.mapSidebarItems(SIDEBAR_GUEST_MENU);

        this.footerMenuItems = this.mapSidebarItems(SIDEBAR_LEGAL_MENU);
    };

    private mapSidebarItems(items: SidebarMenuItem[], withTooltip: boolean = false): MenuItem[] {
        return items.map((item) => this.mapItemToPrimeNg(item, withTooltip));
    }

    private mapItemToPrimeNg(item: SidebarMenuItem, withTooltip: boolean = false): MenuItem {
        const link = item.routerLink ? [item.routerLink] : undefined;

        let isActive = false;
        if (item.routerLink) {
            isActive = this.router.isActive(item.routerLink, {
                paths: 'subset',
                queryParams: 'ignored',
                fragment: 'ignored',
                matrixParams: 'ignored',
            });
        }

        return {
            label: withTooltip ? undefined : item.label,
            icon: item.icon,
            routerLink: link,
            styleClass: withTooltip ? 'icon-only-menu-item' : isActive ? 'active-sidebar-menu' : '',
            tooltip: withTooltip ? item.label : undefined,
        };
    }
}