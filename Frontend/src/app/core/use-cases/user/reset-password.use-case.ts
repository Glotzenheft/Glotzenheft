import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";
import { ResetPasswordCredentials } from "../../../shared/interfaces/login";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UC_ResetPassword {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (resetPasswordCredentials: ResetPasswordCredentials): Observable<any> | null => {
        return this.userRepository.resetPassword(resetPasswordCredentials)
    }
}