import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";
import { Observable } from "rxjs";
import { UserActivitiesResponse } from "../../../../shared/interfaces/user-interfaces";

@Injectable({ providedIn: 'root' })
export class UC_GetUserActivites {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (responsePage: number): Observable<UserActivitiesResponse> | null => {
        return this.userRepository.getUserActivities(responsePage)
    }
}