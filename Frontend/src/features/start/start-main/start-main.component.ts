import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

@Component({
  selector: 'app-start-main',
  imports: [
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './start-main.component.html',
  styleUrl: './start-main.component.css',
})
export class StartMainComponent {
  public areLoginButtonsVisible: boolean = !isUserLoggedIn();

  constructor(private router: Router, private m: MessageService) {}

  navigateToLogin = () => {
    this.router.navigateByUrl('/login');
  };

  public navigateToStartPage = () => {
    this.router.navigateByUrl(ROUTES_LIST[8].fullUrl);
  };

  navigateToRegister = () => {
    this.m.add({
      severity: 'info',
      summary: 'Works',
    });
    this.router.navigateByUrl('/register');
  };
}
