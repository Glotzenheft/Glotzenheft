import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Observable } from "rxjs";

@Injectable()
export class UC_IsSearchBarVisible {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public observe = (): Observable<boolean> => { return this.userRepository.isSearchBarVisible$ }
}