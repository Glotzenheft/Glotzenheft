/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Inject, Injectable } from '@angular/core';
import {
    I_SecurityRepository,
    IT_SECURITY_REPOSITORY,
} from '../../interfaces/security.repository';

@Injectable()
export class UC_IsValidUserName {
    constructor(
        @Inject(IT_SECURITY_REPOSITORY)
        private readonly securityRepository: I_SecurityRepository,
    ) {}

    public execute = (userName: string): boolean => {
        return this.securityRepository.isValidUserName(userName);
    };
}
