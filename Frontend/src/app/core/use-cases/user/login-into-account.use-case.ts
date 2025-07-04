import { Observable } from "rxjs";
import { LoginAndMessageResponse, LoginCredentials } from "../../../shared/interfaces/login";
import { I_UserRepository } from "../../interfaces/user.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_LoginIntoAccount {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (loginData: LoginCredentials): Observable<LoginAndMessageResponse> => {
        return this.userRepository.loginIntoAccount(loginData)
    }
}