import { Injectable } from "@angular/core";
import { I_NavigationRepository } from "../../interfaces/navigation.repository";

@Injectable({ providedIn: 'root' })
export class UC_NavigateToStartPage {
    constructor(private readonly navigationRepository: I_NavigationRepository) { }

    public execute = () => { return this.navigationRepository.navigateToStartPage() }
}