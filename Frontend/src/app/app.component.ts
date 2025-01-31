import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FooterComponent } from '../features/components/footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { SearchBarComponent } from '../features/components/search-bar/search-bar.component';
import { MediaService } from '../service/media/media.service';
import { Observable } from 'rxjs';
import { MultiSearchResponse } from '../shared/interfaces/media-interfaces';
import { MultiSearchComponent } from '../features/components/search/multi-search.component';
import { SearchService } from '../service/search/search.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    FooterComponent,
    ButtonModule,
    TooltipModule,
    CommonModule,
    SearchBarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isSidebarOpen: boolean = window.innerWidth <= 850 ? false : true; // sidebar should be open by default
  isMultiSearchResponseVisible: boolean = false;
  userQuery: string = '';

  constructor(
    private mediaService: MediaService,
    public searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((searchTerm: string) => {
      this.isMultiSearchResponseVisible = !searchTerm.trim() ? false : true;
    });
  }

  toggleSidebar = (newValue: boolean) => {
    console.log('new sidebar visible value: ', newValue);
    this.isSidebarOpen = newValue;
  };

  setUserQuery = (query: string) => {
    this.userQuery = query;
  };
}
