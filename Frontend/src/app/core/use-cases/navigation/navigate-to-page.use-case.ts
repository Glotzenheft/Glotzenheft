import { Inject, Injectable } from "@angular/core";
import { I_NavigationRepository, IT_NAVIGATION_REPOSITORY } from "../../interfaces/navigation.repository";

@Injectable()
export class UC_NavigateToPage {
    constructor(@Inject(IT_NAVIGATION_REPOSITORY) private readonly navigationRepository: I_NavigationRepository) { }

    public execute = (tmdbId: string, isMovie: boolean) => { return this.navigationRepository.navigateToPage(tmdbId, isMovie) }
}