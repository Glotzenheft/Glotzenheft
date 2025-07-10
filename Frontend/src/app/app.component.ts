import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FooterComponent } from '../features/footerCOMPONENTS/footer/footer.component';
import { SearchBarComponent } from '../features/media/mediaSearchCOMPONENTS/search-bar/search-bar.component';
import { UserLinksComponent } from '../features/user/userMenuPages/user-links/user-links.component';
import { UserMenuComponent } from '../features/user/userMenuPages/user-menu/user-menu.component';
import { getMessageObject } from './shared/variables/message-vars';
import { UC_GetSearchTerm } from './core/use-cases/search/get-search-term.use-case';
import { UC_GetShowToast } from './core/use-cases/auth/get-show-toast.use-case';

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
        UserLinksComponent,
        UserMenuComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [MessageService, UC_GetShowToast, UC_GetSearchTerm],
})
export class AppComponent implements OnInit, OnDestroy {
    public isSidebarOpen: boolean = window.innerWidth <= 850 ? false : true; // sidebar should be open by default
    public isMultiSearchResponseVisible: boolean = false;
    public userQuery: string = '';
    public toastSubscription!: Subscription;

    constructor(
        public messageService: MessageService,
        public getSearchTermUseCase: UC_GetSearchTerm,
        public getShowToastUseCase: UC_GetShowToast
    ) { }

    ngOnInit(): void {
        this.getSearchTermUseCase.observe().subscribe((searchTerm: string) => {
            this.isMultiSearchResponseVisible = !searchTerm.trim() ? false : true;
        });

        this.toastSubscription = this.getShowToastUseCase.observe().subscribe(
            (show: boolean) => {
                if (show) {
                    this.messageService.add(
                        getMessageObject(
                            'error',
                            'Kein Zugriff',
                            'Bitte melde dich an, um Zugriff zu erhalten.'
                        )
                    );
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
