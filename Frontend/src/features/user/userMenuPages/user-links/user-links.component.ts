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

import { Component, OnInit } from '@angular/core';
import { VisibleRoute } from '../../../../app/shared/interfaces/route-list-item';
import { getVisibleRoutesForUser } from '../../../../app/shared/variables/routes-list';
import { UC_IsSearchBarVisible } from '../../../../app/core/use-cases/user/get-is-search-bar-visible.use-case';


@Component({
    selector: 'app-user-links',
    imports: [],
    templateUrl: './user-links.component.html',
    styleUrl: './user-links.component.css',
    providers: [UC_IsSearchBarVisible]
})
export class UserLinksComponent implements OnInit {
    public isLoggedIn: boolean = false;
    public personalUserLinks: VisibleRoute[] = getVisibleRoutesForUser();

    constructor(
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible
    ) { }

    ngOnInit(): void {
        this.isSearchBarVisibleUseCase.observe().subscribe((status: boolean) => {
            this.isLoggedIn = status;
        });
    }
}
