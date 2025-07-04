import { Observable } from "rxjs";
import { I_UserRepository } from "../interfaces/user.repository";
import { LoginAndMessageResponse, LoginCredentials } from "../../shared/interfaces/login";

export class UC_LoginUser {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (loginData: LoginCredentials): Observable<LoginAndMessageResponse> => {
        return this.userRepository.loginIntoAccount(loginData)
    }
}