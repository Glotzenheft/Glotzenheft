import { InjectionToken } from "@angular/core"
import { Observable } from "rxjs"

export interface I_SearchRepository {
    // variables
    searchTerm$: Observable<string>,
    // functions
    updateSearchTerm: (newSearchTerm: string) => void
}

// IT = Injection Token
export const IT_SEARCH_REPOSITORY = new InjectionToken<I_SearchRepository>("I_SearchRepository")