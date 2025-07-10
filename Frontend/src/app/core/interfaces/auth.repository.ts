import { InjectionToken } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface I_AuthRepository {
    // variables
    showToast$: BehaviorSubject<boolean>,
    // functions
    triggerToast: () => void,
    isUserLoggedIn: () => boolean
}

// IT = Injection Token
export const IT_AUTH_REPOSITORY = new InjectionToken<I_AuthRepository>("I_AuthRepository") 