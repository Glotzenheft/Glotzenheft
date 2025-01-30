import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-bar',
  imports: [InputTextModule, InputIcon, IconFieldModule, ButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

  navigateToSearch = () => {
    console.log('Nutzeranfrage: ', this.searchQuery);
    this.router.navigate(['/test-search'], {
      queryParams: { query: this.searchQuery },
    });
  };

  handleInput = (event: Event) => {
    this.searchQuery = (event.target as HTMLInputElement).value;
  };
}
