import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Film } from "../../../shared/interfaces/media-interfaces";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_GetFilmDetails {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (movieId: string): Observable<Film> | null => {
        return this.mediaRepository.getFilmDetails(movieId)
    }
}