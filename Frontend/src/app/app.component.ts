import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Observable, Subscription } from 'rxjs';
import { MultiSearchResponse } from '../shared/interfaces/media-interfaces';
import { MultiSearchComponent } from '../features/components/search/multi-search.component';
import { SearchService } from '../service/search/search.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
})
export class AppComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = window.innerWidth <= 850 ? false : true; // sidebar should be open by default
  isMultiSearchResponseVisible: boolean = false;
  userQuery: string = '';
  private toastSubscription!: Subscription;

  constructor(
    private mediaService: MediaService,
    public searchService: SearchService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.searchService.searchTerm$.subscribe((searchTerm: string) => {
      this.isMultiSearchResponseVisible = !searchTerm.trim() ? false : true;
    });

    this.toastSubscription = this.mediaService.showToast$.subscribe(
      (show: boolean) => {
        if (show) {
          this.messageService.add({
            severity: 'error',
            summary: 'Kein Zugriff',
            detail:
              'Sie haben zur Zeit keinen Zugriff auf diese Seite. Bitte melden Sie sich an, um Zugriff zu erhalten.',
            life: 7000,
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.toastSubscription.unsubscribe();
  }

  toggleSidebar = (newValue: boolean) => {
    this.isSidebarOpen = newValue;
  };

  setUserQuery = (query: string) => {
    this.userQuery = query;
  };
}
