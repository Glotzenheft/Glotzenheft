import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";

@Injectable({ providedIn: 'root' })
export class UC_IncreaseLoginTries {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = () => { return this.userRepository.increaseLoginTries() }
}