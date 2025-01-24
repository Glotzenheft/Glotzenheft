import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}

  navigateToLogin = () => {
    this.router.navigateByUrl('/login');
  };

  navigateToRegister = () => {
    this.router.navigateByUrl('/register');
  };
}
