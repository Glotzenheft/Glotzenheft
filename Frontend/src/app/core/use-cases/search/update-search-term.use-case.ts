import { Injectable } from "@angular/core";
import { I_SearchRepository } from "../../interfaces/search.repository";

@Injectable({ providedIn: 'root' })
export class UC_UpdateSearchTerm {
    constructor(private readonly searchRepository: I_SearchRepository) { }

    public execute = (newSearchTerm: string) => { return this.searchRepository.updateSearchTerm(newSearchTerm) }
}