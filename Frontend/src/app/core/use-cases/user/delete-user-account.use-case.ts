import { Inject, Injectable } from "@angular/core";
import { I_UserRepository, IT_USER_REPOSITORY } from "../../interfaces/user.repository";
import { DeleteUserRequest } from "../../../shared/interfaces/user-interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UC_DeleteUserAccount {
    constructor(@Inject(IT_USER_REPOSITORY) private readonly userRepository: I_UserRepository) { }

    public execute = (userData: DeleteUserRequest): Observable<any> | null => {
        return this.userRepository.deleteUserAccount(userData)
    }
}