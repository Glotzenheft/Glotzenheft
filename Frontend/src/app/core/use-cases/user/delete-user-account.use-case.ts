import { Injectable } from "@angular/core";
import { I_UserRepository } from "../../interfaces/user.repository";
import { DeleteUserRequest } from "../../../shared/interfaces/user-interfaces";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UC_DeleteUserAccount {
    constructor(private readonly userRepository: I_UserRepository) { }

    public execute = (userData: DeleteUserRequest): Observable<any> | null => {
        return this.userRepository.deleteUserAccount(userData)
    }
}