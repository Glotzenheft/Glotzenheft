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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SearchBarComponent } from '../features/media/mediaSearchCOMPONENTS/search-bar/search-bar.component';
import { getMessageObject } from './shared/variables/message-vars';
import { UC_GetSearchTerm } from './core/use-cases/search/get-search-term.use-case';
import { UC_GetShowToast } from './core/use-cases/auth/get-show-toast.use-case';
import { SidebarComponent} from "./core/layout/sidebar/sidebar.component";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        ButtonModule,
        TooltipModule,
        CommonModule,
        SearchBarComponent,
        ToastModule,
        SidebarComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [MessageService, UC_GetShowToast, UC_GetSearchTerm],
})
export class AppComponent implements OnInit, OnDestroy {
    public isSidebarOpen: boolean = window.innerWidth > 850; // sidebar should be open by default
    public isMultiSearchResponseVisible: boolean = false;
    public userQuery: string = '';
    public toastSubscription!: Subscription;

    constructor(
        public messageService: MessageService,
        public getSearchTermUseCase: UC_GetSearchTerm,
        public getShowToastUseCase: UC_GetShowToast,
    ) {}

    ngOnInit(): void {
        this.getSearchTermUseCase.observe().subscribe((searchTerm: string) => {
            this.isMultiSearchResponseVisible = !!searchTerm.trim();
        });

        this.toastSubscription = this.getShowToastUseCase
            .observe()
            .subscribe((show: boolean) => {
                if (show) {
                    this.messageService.add(
                        getMessageObject(
                            'error',
                            'Kein Zugriff',
                            'Bitte melde dich an, um Zugriff zu erhalten.',
                        ),
                    );
                }
            });
    }

    ngOnDestroy(): void {
        this.toastSubscription.unsubscribe();
    }

    toggleSidebar = (newValue: boolean) => {
        this.isSidebarOpen = newValue;
    };

    setUserQuery = (query: string) => {
        this.userQuery = query;
    };
}
