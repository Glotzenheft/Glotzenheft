import { InjectionToken } from "@angular/core"

export interface I_StringRepository {
    shortenString: (str: string) => string
}

// IT = Injection Token
export const IT_STRING_REPOSITORY = new InjectionToken<I_StringRepository>("I_StringRepository")