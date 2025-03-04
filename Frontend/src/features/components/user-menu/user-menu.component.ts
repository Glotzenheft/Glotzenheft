import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { UserMenuList } from '../../../shared/interfaces/user-interfaces';
import { UserService } from '../../../service/user/user.service';
import { Router } from '@angular/router';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { MessageService } from 'primeng/api';
import { StringService } from '../../../service/string/string.service';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { getMessageObject } from '../../../shared/variables/message-vars';

@Component({
  selector: 'app-user-menu',
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    TooltipModule,
    AvatarGroupModule,
    AvatarModule,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css',
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
            this.userService.logoutOfAccount();
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
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    public stringService: StringService
  ) {}

  ngOnInit(): void {
    // this.userName = this.userService.getUserName() ?? '';
    this.userService.isSearchBarVisible$.subscribe((status: boolean) => {
      this.isUserMenuVisible = status;
    });

    this.userService.visibleUserName$.subscribe((userName: string) => {
      this.userName = localStorage.getItem('username') ?? userName;
    });
  }

  public isUserLoggedInInAccount = isUserLoggedIn;
}
