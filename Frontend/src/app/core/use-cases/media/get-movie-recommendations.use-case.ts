import { Inject, Injectable } from "@angular/core";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Observable } from "rxjs";
import { I_MovieRecommendations } from "../../../shared/interfaces/movie-recommendation-interface";

@Injectable()
export class UC_GetMovieRecommendations {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (movieId: number, movieTitle: string): Observable<I_MovieRecommendations> => { return this.mediaRepository.getMovieRecommendations(movieId, movieTitle) }
}