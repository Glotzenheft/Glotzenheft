import { Inject, Injectable } from "@angular/core";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Observable } from "rxjs";
import { I_HighestRecommendations } from "../../../shared/interfaces/movie-recommendation-interface";

@Injectable()
export class UC_GetHighestMedia {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<I_HighestRecommendations> => { return this.mediaRepository.getHighestRecommendations(); }
}