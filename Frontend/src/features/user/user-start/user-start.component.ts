import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputIcon } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Router, RouterOutlet } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { Observable } from 'rxjs';
import { Tracklist } from '../../../shared/interfaces/tracklist-interfaces';
import { MediaService } from '../../../service/media/media.service';
import { MessageService } from 'primeng/api';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { UserService } from '../../../service/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-start',
  imports: [
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    RouterOutlet,
    PanelModule,
    CommonModule,
  ],
  templateUrl: './user-start.component.html',
  styleUrl: './user-start.component.css',
})
export class UserStartComponent implements OnInit {
  public userTracklists$: Observable<Tracklist[]> | null = null;
  public isError: boolean = false;

  constructor(
    private mediaService: MediaService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userTracklists$ = this.mediaService.getAllUserTracklists();

    if (!this.userTracklists$) {
      this.isError;
      return;
    }

    this.userTracklists$.subscribe({
      next: () => {},
      error: (err: any) => {
        if (err.status === 401) {
          this.messageService.add({
            life: 7000,
            severity: 'error',
            summary: 'Ungültige Authentifizierung',
            detail: 'Deine Authentifizierungsdaten sind ungültig.',
          });

          this.userService.logoutOfAccount();

          // navigate to login page
          this.router.navigateByUrl(`/${ROUTES_LIST[1].fullUrl}`);
          return;
        }

        this.isError = true;
      },
    });
  }
}
