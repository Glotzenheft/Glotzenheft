import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";

@Injectable({ providedIn: 'root' })
export class UC_IncreaseLoginTries {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = () => { return this.userRepository.increaseLoginTries() }
}