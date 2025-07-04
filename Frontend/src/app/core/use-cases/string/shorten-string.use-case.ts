import { I_StringRepository } from "../../interfaces/string.repository";

export class UC_ShortenString {
    constructor(private readonly stringRepository: I_StringRepository) { }

    public execute = (str: string): string => { return this.stringRepository.shortenString(str) }
}