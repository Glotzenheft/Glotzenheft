import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Observable } from "rxjs";
import { WatchTimeStatistic } from "../../../shared/statistic-interfaces";

@Injectable({ providedIn: 'root' })
export class UC_GetUserStatisticWatchTime {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (): Observable<WatchTimeStatistic> | null => {
        return this.userRepository.getUserStatisticWatchTime()
    }

}
