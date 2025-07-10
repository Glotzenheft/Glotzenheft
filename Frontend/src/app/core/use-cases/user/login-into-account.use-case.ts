import { Observable } from "rxjs";
import { LoginAndMessageResponse, LoginCredentials } from "../../../shared/interfaces/login";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_LoginIntoAccount {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (loginData: LoginCredentials): Observable<LoginAndMessageResponse> => {
        return this.userRepository.loginIntoAccount(loginData)
    }
}