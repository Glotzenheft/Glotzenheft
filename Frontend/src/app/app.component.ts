import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FooterComponent } from '../features/components/footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    FooterComponent,
    ButtonModule,
    TooltipModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isSidebarOpen: boolean = true; // sidebar should be open by default

  toggleSidebar = (newValue: boolean) => {
    this.isSidebarOpen = newValue;
  };
}
