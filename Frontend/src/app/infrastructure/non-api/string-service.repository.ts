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

import { Injectable } from '@angular/core';
import { I_StringRepository } from '../../core/interfaces/string.repository';

@Injectable({
    providedIn: 'root',
})
export class R_String implements I_StringRepository {
    constructor() {}

    public shortenString = (str: string): string => {
        // width in px
        const windowWidth: number = window.innerWidth;

        if (windowWidth < 500) {
            if (str.length < 21) {
                return str;
            }
            return `${str.substring(0, 20)}...`;
        } else if (windowWidth >= 500 && windowWidth < 700) {
            if (str.length < 61) {
                return str;
            }
            return `${str.substring(0, 60)}...`;
        } else {
            if (str.length < 101) {
                return str;
            }
            return `${str.substring(0, 80)}...`;
        }
    };
}
