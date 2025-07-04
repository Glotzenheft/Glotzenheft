import { Observable } from "rxjs";
import { LoginAndMessageResponse, LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from "../../shared/interfaces/login";
import { DeleteUserRequest } from "../../shared/interfaces/user-interfaces";
import { RatingStatistic, WatchTimeStatistic } from "../../shared/statistic-interfaces";
import { UserActivitiesResponse } from "../../../shared/interfaces/user-interfaces";
import { InjectionToken } from "@angular/core";

export interface I_UserRepository {
    loginIntoAccount: (loginData: LoginCredentials) => Observable<LoginAndMessageResponse>,
    registerAccount: (registerData: RegisterCredentials) => Observable<LoginAndMessageResponse>,
    logoutOfAccount: () => void,
    resetPassword: (resetPasswordCredentials: ResetPasswordCredentials) => Observable<any> | null,
    showLoginMessage: () => void,
    showNoAccessMessage: () => void,
    isUserLoginValid: () => boolean,
    increaseLoginTries: () => void,
    deleteUserAccount: (userData: DeleteUserRequest) => Observable<any> | null,
    getUserName: () => string | null,
    getUserStatisticWatchTime: () => Observable<WatchTimeStatistic> | null,
    getUserActivities: (responsePage: number) => Observable<UserActivitiesResponse> | null,
    getUserRatings: () => Observable<RatingStatistic> | null,
}

// IT = Injection Token
export const IT_USER_REPOSITORY = new InjectionToken<I_UserRepository>("I_UserRepository")