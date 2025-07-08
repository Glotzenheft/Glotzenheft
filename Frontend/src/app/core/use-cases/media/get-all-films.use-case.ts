import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Film } from "../../../shared/interfaces/media-interfaces";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_GetAllFilms {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<Film[]> => {
        return this.mediaRepository.getAllFilms()
    }
}