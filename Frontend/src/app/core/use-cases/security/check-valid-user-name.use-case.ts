import { Inject, Injectable } from "@angular/core";
import { I_SecurityRepository, IT_SECURITY_REPOSITORY } from "../../interfaces/security.repository";

@Injectable({ providedIn: 'root' })
export class UC_IsValidUserName {
    constructor(@Inject(IT_SECURITY_REPOSITORY) private readonly securityRepository: I_SecurityRepository) { }

    public execute = (userName: string): boolean => { return this.securityRepository.isValidUserName(userName) }
}