import { Inject, Injectable } from "@angular/core";
import { I_SecurityRepository, IT_SECURITY_REPOSITORY } from "../../interfaces/security.repository";

@Injectable()
export class UC_ValidateMediaURL {
    constructor(@Inject(IT_SECURITY_REPOSITORY) private readonly securityRepository: I_SecurityRepository) { }

    public execute = (mediaURL: string): boolean => { return this.securityRepository.validateMediaURL(mediaURL) }
}