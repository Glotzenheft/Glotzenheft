import { computed, Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { I_SearchRepository } from '../../core/interfaces/search.repository';

@Injectable({
    providedIn: 'root',
})
export class R_Search implements I_SearchRepository {
    private searchTerm = new BehaviorSubject<string>('');
    public searchTerm$: Observable<string> = this.searchTerm.asObservable();
    public isSearchTermGiven = signal(false);

    constructor() { }

    public updateSearchTerm = (newSearchTerm: string) => {
        this.searchTerm.next(newSearchTerm);
        this.isSearchTermGiven.set(true);
    };
}
