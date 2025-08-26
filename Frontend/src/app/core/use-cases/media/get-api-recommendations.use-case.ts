import { Inject, Injectable } from "@angular/core";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Observable } from "rxjs";
import { I_Recommendation } from "../../../shared/interfaces/recommendation-interfaces";

@Injectable()
export class UC_GetAPIRecommendations {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tmdbId: number, isMovie: boolean): Observable<I_Recommendation[] | null> => { return this.mediaRepository.getAPIRecommendations(tmdbId, isMovie); }
}