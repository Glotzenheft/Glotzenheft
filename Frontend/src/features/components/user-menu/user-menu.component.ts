import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { UserMenuList } from '../../../shared/interfaces/user-interfaces';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, MenuModule, ButtonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
})
export class UserMenuComponent {
  public userMenuList: UserMenuList[] = [
    {
      label: 'Optionen',
      items: [
        {
          label: 'Startseite',
          icon: 'pi pi-home',
          command: () => {
            this.router.navigateByUrl(ROUTES_LIST[8].fullUrl);
          },
        },
        {
          label: 'Passwort ändern',
          icon: 'pi pi-user-edit',
          command: () => {
            this.router.navigateByUrl(ROUTES_LIST[9].fullUrl);
          },
        },
        {
          label: 'Meine Tracklisten',
          icon: 'pi pi-list',
          command: () => {
            this.router.navigateByUrl(ROUTES_LIST[12].fullUrl);
          },
        },
        {
          label: 'Ausloggen',
          icon: 'pi pi-sign-out',
          command: () => {
            this.userService.logoutOfAccount();
            this.messageService.add({
              life: 7000,
              severity: 'success',
              summary: 'Erfolgreich ausgeloggt.',
            });
            this.router.navigateByUrl(ROUTES_LIST[10].fullUrl);
          },
        },
      ],
    },
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  public isUserLoggedInInAccount = isUserLoggedIn;
}
