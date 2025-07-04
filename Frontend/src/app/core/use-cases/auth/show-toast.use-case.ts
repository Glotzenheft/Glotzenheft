import { I_AuthRepository } from "../../interfaces/auth.repository";

export class UC_ShowToast {
    constructor(private readonly authRepository: I_AuthRepository) { }

    public execute = () => {
        return this.authRepository.triggerToast()
    }
}