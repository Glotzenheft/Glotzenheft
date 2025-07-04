import { Injectable } from "@angular/core";
import { I_SecurityRepository } from "../../interfaces/security.repository";

@Injectable({ providedIn: 'root' })
export class UC_IsValidUserName {
    constructor(private readonly securityRepository: I_SecurityRepository) { }

    public execute = (userName: string): boolean => { return this.securityRepository.isValidUserName(userName) }
}