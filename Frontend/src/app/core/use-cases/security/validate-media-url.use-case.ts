import { I_SecurityRepository } from "../../interfaces/security.repository";

export class UC_ValidateMediaURL {
    constructor(private readonly securityRepository: I_SecurityRepository) { }

    public execute = (mediaURL: string): boolean => { return this.securityRepository.validateMediaURL(mediaURL) }
}