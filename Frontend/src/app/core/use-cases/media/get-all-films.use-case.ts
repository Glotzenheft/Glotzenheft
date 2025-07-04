import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";
import { Film } from "../../../shared/interfaces/media-interfaces";

export class UC_GetAllFilms {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): Observable<Film[]> => {
        return this.mediaRepository.getAllFilms()
    }
}