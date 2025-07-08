import { InjectionToken } from "@angular/core"

export interface I_SecurityRepository {
    // variables
    INVALID_CHARS: string[],
    validateMediaURL: (mediaURL: string) => boolean,
    isValidUserName: (userName: string) => boolean
}

// IT = Injection Token
export const IT_SECURITY_REPOSITORY = new InjectionToken<I_SecurityRepository>("I_SecurityRepository")