import { Injectable } from "@angular/core";
import { I_StringRepository } from "../../interfaces/string.repository";

@Injectable({ providedIn: 'root' })
export class UC_ShortenString {
    constructor(private readonly stringRepository: I_StringRepository) { }

    public execute = (str: string): string => { return this.stringRepository.shortenString(str) }
}