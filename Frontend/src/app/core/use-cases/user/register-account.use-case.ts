import { Observable } from "rxjs";
import { LoginAndMessageResponse, RegisterCredentials } from "../../../shared/interfaces/login";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { Inject, Injectable } from "@angular/core";

@Injectable()
export class UC_RegisterAccount {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (registerData: RegisterCredentials): Observable<LoginAndMessageResponse> => {
        return this.userRepository.registerAccount(registerData)
    }
}