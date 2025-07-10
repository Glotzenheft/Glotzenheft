import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { ResetPasswordCredentials } from "../../../shared/interfaces/login";
import { Observable } from "rxjs";

@Injectable()
export class UC_ResetPassword {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (resetPasswordCredentials: ResetPasswordCredentials): Observable<any> | null => {
        return this.userRepository.resetPassword(resetPasswordCredentials)
    }
}