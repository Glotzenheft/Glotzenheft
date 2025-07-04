import { I_AuthRepository } from "../../interfaces/auth.repository";

export class UC_CheckUserAuth {
    constructor(private readonly authRepository: I_AuthRepository) { }

    public execute = (): boolean => {
        return this.authRepository.isUserLoggedIn()
    }
}