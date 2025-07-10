import { Inject, Injectable } from "@angular/core";
import { I_SearchRepository, IT_SEARCH_REPOSITORY } from "../../interfaces/search.repository";

@Injectable()
export class UC_UpdateSearchTerm {
    constructor(@Inject(IT_SEARCH_REPOSITORY) private readonly searchRepository: I_SearchRepository) { }

    public execute = (newSearchTerm: string) => { return this.searchRepository.updateSearchTerm(newSearchTerm) }
}