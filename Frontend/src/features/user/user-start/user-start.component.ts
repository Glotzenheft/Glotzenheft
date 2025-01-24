import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputIcon } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-start',
  imports: [InputTextModule, IconFieldModule, InputIconModule, InputIcon, TooltipModule, RouterOutlet],
  templateUrl: './user-start.component.html',
  styleUrl: './user-start.component.css'
})
export class UserStartComponent {

}
