import { Observable } from "rxjs";
import { CreateMovieTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_CreateNewMovieTracklist {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (data: CreateMovieTracklistData): Observable<any> => {
        return this.mediaRepository.createNewMovieTracklist(data)
    }
}