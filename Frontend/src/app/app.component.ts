import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputTextModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
