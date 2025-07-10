import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-user-layout',
    imports: [RouterModule, IconFieldModule, InputIconModule, InputTextModule],
    templateUrl: './user-layout.component.html',
    styleUrl: './user-layout.component.css',
})
export class UserLayoutComponent { }
