import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";
import { Observable } from "rxjs";
import { WatchTimeStatistic } from "../../../shared/statistic-interfaces";

@Injectable({ providedIn: 'root' })
export class UC_GetUserStatisticWatchTime {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (): Observable<WatchTimeStatistic> | null => {
        return this.userRepository.getUserStatisticWatchTime()
    }

}
