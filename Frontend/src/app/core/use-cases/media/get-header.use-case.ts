import { Inject, Injectable } from "@angular/core";
import { I_MediaRepository, IT_MEDIA_REPOSITORY } from "../../interfaces/media.repository";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class UC_GetHeader {
    constructor(@Inject(IT_MEDIA_REPOSITORY) private readonly mediaRepository: I_MediaRepository) { }

    public execute = (): HttpHeaders | null => { return this.mediaRepository.getHeader() }

}