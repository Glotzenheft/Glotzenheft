import { I_NavigationRepository } from "../../interfaces/navigation.repository";

export class UC_NavigateToMultiSearch {
    constructor(private readonly navigationRepository: I_NavigationRepository) { }

    public execute = () => { return this.navigationRepository.navigateToMultiSearch() }
}