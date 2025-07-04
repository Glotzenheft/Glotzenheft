import { Inject, Injectable } from "@angular/core";
import { I_StringRepository, IT_STRING_REPOSITORY } from "../../interfaces/string.repository";

@Injectable({ providedIn: 'root' })
export class UC_ShortenString {
    constructor(@Inject(IT_STRING_REPOSITORY) private readonly stringRepository: I_StringRepository) { }

    public execute = (str: string): string => { return this.stringRepository.shortenString(str) }
}