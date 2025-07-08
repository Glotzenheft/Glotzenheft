import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleRoute } from '../../../../app/shared/interfaces/route-list-item';
import { getVisibleRoutesForUser } from '../../../../app/shared/variables/routes-list';
import { UC_IsSearchBarVisible } from '../../../../app/core/use-cases/user/get-is-search-bar-visible.use-case';


@Component({
    selector: 'app-user-links',
    imports: [CommonModule],
    templateUrl: './user-links.component.html',
    styleUrl: './user-links.component.css',
})
export class UserLinksComponent implements OnInit {
    public isLoggedIn: boolean = false;
    public personalUserLinks: VisibleRoute[] = getVisibleRoutesForUser();

    constructor(
        private isSearchBarVisibleUseCase: UC_IsSearchBarVisible
    ) { }

    ngOnInit(): void {
        this.isSearchBarVisibleUseCase.observe().subscribe((status: boolean) => {
            this.isLoggedIn = status;
        });
    }
}
