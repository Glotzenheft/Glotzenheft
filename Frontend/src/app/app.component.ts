import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { SearchService } from '../service/search/search.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth/auth.service';
import { UserService } from '../service/user/user.service';
import { FooterComponent } from '../features/footerCOMPONENTS/footer/footer.component';
import { SearchBarComponent } from '../features/media/mediaSearchCOMPONENTS/search-bar/search-bar.component';
import { UserLinksComponent } from '../features/user/userMenuPages/user-links/user-links.component';
import { UserMenuComponent } from '../features/user/userMenuPages/user-menu/user-menu.component';
import { getMessageObject } from './shared/variables/message-vars';
import { UC_GetUserName } from './core/use-cases/user/get-user-name.use-case';

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
    providers: [MessageService],
})
export class AppComponent implements OnInit, OnDestroy {
    public isSidebarOpen: boolean = window.innerWidth <= 850 ? false : true; // sidebar should be open by default
    public isMultiSearchResponseVisible: boolean = false;
    public userQuery: string = '';
    public toastSubscription!: Subscription;

    constructor(
        public searchService: SearchService,
        public messageService: MessageService,
        private authService: AuthService,
        public getUserNameUseCase: UC_GetUserName
    ) { }

    ngOnInit(): void {
        this.searchService.searchTerm$.subscribe((searchTerm: string) => {
            this.isMultiSearchResponseVisible = !searchTerm.trim() ? false : true;
        });

        this.toastSubscription = this.authService.showToast$.subscribe(
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

        console.log("Hallo", this.getUserNameUseCase.execute())
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

    //   @HostListener('window:keydown', ['$event'])
    //   onKeyDown = (event: KeyboardEvent) => {
    //     if (
    //       (event.ctrlKey && event.shiftKey && event.key === 'I') ||
    //       event.key === 'F12' ||
    //       (event.ctrlKey && event.shiftKey && event.key === 'C')
    //     ) {
    //       event.preventDefault();
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Kein Zugriff auf Dev-Tools',
    //         detail:
    //           'Sie haben keinen Zugriff auf die Entwicklungswerkzeuge in dieser Applikation.',
    //       });
    //     }
    //   };
}
