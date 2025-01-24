import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HeaderMainComponent } from '../features/header/header-main/header-main.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputTextModule, InputIconModule, IconFieldModule, HeaderMainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
