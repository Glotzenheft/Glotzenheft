import { InjectionToken } from "@angular/core"

export interface I_AuthRepository {
    triggerToast: () => void,
    isUserLoggedIn: () => boolean
}

// IT = Injection Token
export const IT_AUTH_REPOSITORY = new InjectionToken<I_AuthRepository>("I_AuthRepository") 