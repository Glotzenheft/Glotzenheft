import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";
import { Observable } from "rxjs";
import { RatingStatistic } from "../../../shared/statistic-interfaces";

@Injectable({ providedIn: 'root' })
export class UC_GetUserRatings {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (): Observable<RatingStatistic> | null => {
        return this.userRepository.getUserRatings()
    }
}