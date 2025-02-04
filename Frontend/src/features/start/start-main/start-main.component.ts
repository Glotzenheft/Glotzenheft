import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-start-main',
  imports: [
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    ButtonModule,
  ],
  templateUrl: './start-main.component.html',
  styleUrl: './start-main.component.css',
})
export class StartMainComponent {
  constructor(private router: Router, private m: MessageService) {}

  navigateToLogin = () => {
    this.router.navigateByUrl('/login');
  };

  navigateToRegister = () => {
    this.m.add({
      severity: 'info',
      summary: 'Works',
    });
    this.router.navigateByUrl('/register');
  };

  
}
