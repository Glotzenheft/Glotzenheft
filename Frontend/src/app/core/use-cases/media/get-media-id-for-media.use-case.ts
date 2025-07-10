import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { MediaIDResponse } from "../../../shared/interfaces/media-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_GetMediaIdForMedia {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tmdbId: number, isMovie: boolean): Observable<MediaIDResponse> => {
        return this.mediaRepository.getMediaIdForMedia(tmdbId, isMovie)
    }
}