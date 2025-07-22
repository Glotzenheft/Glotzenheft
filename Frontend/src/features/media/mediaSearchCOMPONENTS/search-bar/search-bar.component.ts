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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { isUserLoggedIn } from '../../../../guards/auth.guard';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { UC_UpdateSearchTerm } from '../../../../app/core/use-cases/search/update-search-term.use-case';
import { UC_IsSearchBarVisible } from '../../../../app/core/use-cases/user/get-is-search-bar-visible.use-case';

@Component({
    selector: 'app-search-bar',
    imports: [
        InputTextModule,
        InputIcon,
        IconFieldModule,
        ButtonModule,
        TooltipModule,
    ],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css',
    providers: [UC_UpdateSearchTerm, UC_IsSearchBarVisible]
})
export class SearchBarComponent implements OnInit {
    searchQuery: string = '';
    public isVisible: boolean = isUserLoggedIn();
    public isBackButtonVisible: boolean = false;

    @Output() emitSearchQuery: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private router: Router,
        private updateSearchTermUseCase: UC_UpdateSearchTerm,
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible
    ) { }

    ngOnInit(): void {
        this.isSearchBarVisibleUseCase.observe().subscribe((status: boolean) => {
            this.isVisible = status;
        });

        this.router.events.subscribe(() => {
            // checking url and if url is movie or tv details page make back button visible; otherwise invisible
            this.isBackButtonVisible =
                this.router.url.startsWith(`/${ROUTES_LIST[5].fullUrl}`) ||
                this.router.url.startsWith(`/${ROUTES_LIST[6].fullUrl}`);
        });
    }

    navigateToSearch = () => {
        this.emitSearchQuery.emit(this.searchQuery);
        this.updateSearchTermUseCase.execute(this.searchQuery);

        if (this.router.url !== `/${ROUTES_LIST[4].fullUrl}`) {
            // checking if user is already on multi search route
            this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
        }
    };

    handleInput = (event: Event) => {
        this.searchQuery = (event.target as HTMLInputElement).value;
    };

    public navigateToMultiSearch = () => {
        this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
    };
}
