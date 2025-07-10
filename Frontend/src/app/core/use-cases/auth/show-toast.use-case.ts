import { Inject, Injectable } from "@angular/core";
import { I_AuthRepository, IT_AUTH_REPOSITORY } from "../../interfaces/auth.repository";

@Injectable()
export class UC_ShowToast {
    constructor(@Inject(IT_AUTH_REPOSITORY) private readonly authRepository: I_AuthRepository) { }

    public execute = () => {
        return this.authRepository.triggerToast()
    }
}