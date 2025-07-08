import { Inject, Injectable } from "@angular/core";
import { I_SecurityRepository, IT_SECURITY_REPOSITORY } from "../../interfaces/security.repository";

@Injectable()
export class UC_GetInvalidChars {
    constructor(@Inject(IT_SECURITY_REPOSITORY) private readonly securityRepository: I_SecurityRepository) { }

    public observe = (): string[] => { return this.securityRepository.INVALID_CHARS }
}