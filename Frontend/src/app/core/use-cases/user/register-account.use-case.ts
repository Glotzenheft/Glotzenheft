import { Observable } from "rxjs";
import { LoginAndMessageResponse, RegisterCredentials } from "../../../shared/interfaces/login";
import { I_UserRepository } from "../../interfaces/user.repository";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UC_RegisterAccount {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (registerData: RegisterCredentials): Observable<LoginAndMessageResponse> => {
        return this.userRepository.registerAccount(registerData)
    }
}