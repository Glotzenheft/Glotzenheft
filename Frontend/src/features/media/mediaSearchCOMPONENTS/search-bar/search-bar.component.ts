import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from '../../../service/search/search.service';
import { ROUTES_LIST } from '../../../shared/variables/routes-list';
import { isUserLoggedIn } from '../../../guards/auth.guard';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user/user.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-search-bar',
  imports: [
    InputTextModule,
    InputIcon,
    IconFieldModule,
    ButtonModule,
    CommonModule,
    TooltipModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent implements OnInit {
  searchQuery: string = '';
  public isVisible: boolean = isUserLoggedIn();
  public isBackButtonVisible: boolean = false;

  @Output() emitSearchQuery: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private router: Router,
    private searchService: SearchService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isSearchBarVisible$.subscribe((status: boolean) => {
      this.isVisible = status;
    });

    this.router.events.subscribe(() => {
      // checking url and if url is movie or tv details page make back button visible; otherwise invisible
      this.isBackButtonVisible =
        this.router.url.startsWith(`/${ROUTES_LIST[5].fullUrl}`) ||
        this.router.url.startsWith(`/${ROUTES_LIST[6].fullUrl}`);
    });
  }

  navigateToSearch = () => {
    this.emitSearchQuery.emit(this.searchQuery);
    this.searchService.updateSearchTerm(this.searchQuery);

    if (this.router.url !== `/${ROUTES_LIST[4].fullUrl}`) {
      // checking if user is already on multi search route
      this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
    }
  };

  handleInput = (event: Event) => {
    this.searchQuery = (event.target as HTMLInputElement).value;
  };

  public navigateToMultiSearch = () => {
    this.router.navigateByUrl(ROUTES_LIST[4].fullUrl);
  };
}
