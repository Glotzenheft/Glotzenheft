import { InjectionToken } from "@angular/core"

export interface I_NavigationRepository {
    navigateToStartPage: () => void,
    navigateToUserStart: () => void,
    navigateToMultiSearch: () => void
}

// IT = Injection Token
export const IT_NAVIGATION_REPOSITORY = new InjectionToken<I_NavigationRepository>("I_NavigationRepository")