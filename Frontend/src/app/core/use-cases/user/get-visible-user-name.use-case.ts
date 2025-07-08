import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UC_VisibleUserName {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public observe = (): Observable<string> => { return this.userRepository.visibleUserName$ }
}