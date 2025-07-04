import { Inject, Injectable } from "@angular/core";
import { I_NavigationRepository, IT_NAVIGATION_REPOSITORY } from "../../interfaces/navigation.repository";

@Injectable({ providedIn: 'root' })
export class UC_NavigateToStartPage {
    constructor(@Inject(IT_NAVIGATION_REPOSITORY) private readonly navigationRepository: I_NavigationRepository) { }

    public execute = () => { return this.navigationRepository.navigateToStartPage() }
}