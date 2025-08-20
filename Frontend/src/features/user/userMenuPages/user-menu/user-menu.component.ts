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
along with this programm.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { UserMenuList } from '../../../../shared/interfaces/user-interfaces';
import { isUserLoggedIn } from '../../../../guards/auth.guard';
import { ROUTES_LIST } from '../../../../app/shared/variables/routes-list';
import { getMessageObject } from '../../../../app/shared/variables/message-vars';
import { UC_IsSearchBarVisible } from '../../../../app/core/use-cases/user/get-is-search-bar-visible.use-case';
import { UC_VisibleUserName } from '../../../../app/core/use-cases/user/get-visible-user-name.use-case';
import { UC_LogoutOfAccount } from '../../../../app/core/use-cases/user/log-out-of-account.use-case';

@Component({
    selector: 'app-user-menu',
    imports: [MenuModule, ButtonModule, TooltipModule],
    templateUrl: './user-menu.component.html',
    styleUrl: './user-menu.component.css',
    providers: [UC_IsSearchBarVisible, UC_VisibleUserName, UC_LogoutOfAccount]
})
export class UserMenuComponent implements OnInit {
    public userMenuList: UserMenuList[] = [
        {
            label: 'Optionen',
            items: [
                {
                    label: 'Passwort ändern',
                    icon: 'pi pi-user-edit',
                    command: () => {
                        this.router.navigateByUrl(ROUTES_LIST[9].fullUrl);
                    },
                },
                {
                    label: 'Account löschen',
                    icon: 'pi pi-trash',
                    command: () => {
                        this.router.navigateByUrl(ROUTES_LIST[13].fullUrl);
                    },
                },
                {
                    label: 'Ausloggen',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.logoutOfAccountUseCase.execute();
                        this.messageService.add(
                            getMessageObject('success', 'Erfolgreich ausgeloggt')
                        );
                        this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    },
                },
            ],
        },
    ];

    public loggedOutMenuList: UserMenuList[] = [
        {
            label: 'Optionen',
            items: [
                {
                    label: 'Einloggen',
                    icon: 'pi pi-sign-in',
                    command: () => {
                        this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
                    },
                },
                {
                    label: 'Registrieren',
                    icon: 'pi pi-user-plus',
                    command: () => {
                        this.router.navigateByUrl(ROUTES_LIST[11].fullUrl);
                    },
                },
            ],
        },
    ];

    public userName: string = '';
    public isUserMenuVisible: boolean = false;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible,
        private visibleUserNameUseCase: UC_VisibleUserName,
        private logoutOfAccountUseCase: UC_LogoutOfAccount
    ) { }

    ngOnInit(): void {
        // this.userName = this.userService.getUserName() ?? '';
        this.isSearchBarVisibleUseCase.observe().subscribe((status: boolean) => {
            this.isUserMenuVisible = status;
        });

        this.visibleUserNameUseCase.observe().subscribe((userName: string) => {
            this.userName = localStorage.getItem('username') ?? userName;
        });
    }

    public isUserLoggedInInAccount = isUserLoggedIn;
}
