import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { MediaIDResponse } from "../../../shared/interfaces/media-interfaces";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_GetMediaIdForMedia {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (tmdbId: number, isMovie: boolean): Observable<MediaIDResponse> => {
        return this.mediaRepository.getMediaIdForMedia(tmdbId, isMovie)
    }
}