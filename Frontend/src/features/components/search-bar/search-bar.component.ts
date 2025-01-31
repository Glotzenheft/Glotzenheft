import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../../../service/search/search.service';

@Component({
  selector: 'app-search-bar',
  imports: [InputTextModule, InputIcon, IconFieldModule, ButtonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchQuery: string = '';

  @Output() emitSearchQuery: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router, private searchService: SearchService) {}

  navigateToSearch = () => {
    this.emitSearchQuery.emit(this.searchQuery);
    this.searchService.updateSearchTerm(this.searchQuery);

    console.log('Nutzeranfrage: ', this.searchQuery);
    this.router.navigateByUrl('test-search');
    // this.router.navigate(['/test-search'], {
    //   queryParams: { query: this.searchQuery },
    // });
  };

  handleInput = (event: Event) => {
    this.searchQuery = (event.target as HTMLInputElement).value;
  };
}
