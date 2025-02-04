import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../../../service/search/search.service';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';

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

    if (this.router.url !== `/${ROUTES_LIST[4].fullUrl}`) {
      // checking if user is already on multi search route
      this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
    }

    // this.router.navigate(['/test-search'], {
    //   queryParams: { query: this.searchQuery },
    // });
  };

  handleInput = (event: Event) => {
    this.searchQuery = (event.target as HTMLInputElement).value;
  };
}
