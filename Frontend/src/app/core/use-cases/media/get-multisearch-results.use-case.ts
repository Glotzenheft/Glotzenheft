import { Observable } from "rxjs";
import { I_MediaRepository } from "../../interfaces/media.repository";

export class UC_GetMultiSearchResults {
    constructor(private readonly mediaRepository: I_MediaRepository) { }

    public execute = (searchString: string, page: number): Observable<any> => {
        return this.mediaRepository.getMultiSearchResults(searchString, page)
    }
}