import { InjectionToken } from "@angular/core"

export interface I_SearchRepository {
    updateSearchTerm: (newSearchTerm: string) => void
}

// IT = Injection Token
export const IT_SEARCH_REPOSITORY = new InjectionToken<I_SearchRepository>("I_SearchRepository")