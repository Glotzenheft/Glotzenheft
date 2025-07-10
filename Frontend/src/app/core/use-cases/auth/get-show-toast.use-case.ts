import { Inject, Injectable } from "@angular/core";
import { I_AuthRepository, IT_AUTH_REPOSITORY } from "../../interfaces/auth.repository";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UC_GetShowToast {
    constructor(@Inject(IT_AUTH_REPOSITORY) private readonly authRepository: I_AuthRepository) { }

    public observe = (): BehaviorSubject<boolean> => {
        return this.authRepository.showToast$
    }
}