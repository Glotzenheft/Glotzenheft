import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderMainComponent } from '../../header/header-main/header-main.component';

@Component({
  selector: 'app-user-layout',
  imports: [RouterModule, HeaderMainComponent],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
