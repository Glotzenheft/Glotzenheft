import { I_SearchRepository } from "../../interfaces/search.repository";

export class UC_UpdateSearchTerm {
    constructor(private readonly searchRepository: I_SearchRepository) { }

    public execute = (newSearchTerm: string) => { return this.searchRepository.updateSearchTerm(newSearchTerm) }
}