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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

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
