import { Observable } from "rxjs";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_GetMultiSearchResults {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (searchString: string, page: number): Observable<any> => {
        return this.mediaRepository.getMultiSearchResults(searchString, page)
    }
}