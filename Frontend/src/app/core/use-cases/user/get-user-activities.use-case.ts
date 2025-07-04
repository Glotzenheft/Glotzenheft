import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Observable } from "rxjs";
import { UserActivitiesResponse } from "../../../../shared/interfaces/user-interfaces";

@Injectable({ providedIn: 'root' })
export class UC_GetUserActivites {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (responsePage: number): Observable<UserActivitiesResponse> | null => {
        return this.userRepository.getUserActivities(responsePage)
    }
}