import { Inject, Injectable } from "@angular/core";
import { I_AuthRepository, IT_AUTH_REPOSITORY } from "../../interfaces/auth.repository";

@Injectable({ providedIn: 'root' })
export class UC_TriggerToast {
    constructor(@Inject(IT_AUTH_REPOSITORY) private readonly authRepository: I_AuthRepository) { }

    public execute = () => { return this.authRepository.triggerToast() }
}