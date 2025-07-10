import { Observable } from "rxjs";
import { CreateMovieTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_CreateNewMovieTracklist {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (data: CreateMovieTracklistData): Observable<any> => {
        return this.mediaRepository.createNewMovieTracklist(data)
    }
}