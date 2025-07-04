import { Inject, Injectable } from "@angular/core";
import { I_SearchRepository, IT_SEARCH_REPOSITORY } from "../../interfaces/search.repository";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UC_GetSearchTerm {
    constructor(@Inject(IT_SEARCH_REPOSITORY) private readonly searchRepository: I_SearchRepository) { }

    public observe = (): Observable<string> => { return this.searchRepository.searchTerm$ }
}