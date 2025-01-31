import { computed, Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  public searchTerm$: Observable<string> = this.searchTerm.asObservable();
  public isSearchTermGiven = signal(false);

  constructor() {}

  updateSearchTerm = (newSearchTerm: string) => {
    this.searchTerm.next(newSearchTerm);
    this.isSearchTermGiven.set(true);
  };
}
