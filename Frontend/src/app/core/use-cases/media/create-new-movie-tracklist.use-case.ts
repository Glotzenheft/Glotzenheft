import { Observable } from "rxjs";
import { CreateMovieTracklistData } from "../../../shared/interfaces/tracklist-interfaces";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_CreateNewMovieTracklist {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (data: CreateMovieTracklistData): Observable<any> => {
        return this.mediaRepository.createNewMovieTracklist(data)
    }
}