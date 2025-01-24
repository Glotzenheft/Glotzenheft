import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { HeaderMainComponent } from '../../header/header-main/header-main.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-start-main',
  imports: [InputTextModule, IconFieldModule, InputIconModule, TooltipModule, HeaderMainComponent, RouterOutlet],
  templateUrl: './start-main.component.html',
  styleUrl: './start-main.component.css'
})
export class StartMainComponent {

}
