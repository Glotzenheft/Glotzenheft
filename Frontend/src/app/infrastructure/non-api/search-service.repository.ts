/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

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
