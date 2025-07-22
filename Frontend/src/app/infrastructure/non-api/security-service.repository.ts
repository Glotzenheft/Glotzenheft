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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Injectable } from '@angular/core';
import { I_SecurityRepository } from '../../core/interfaces/security.repository';

@Injectable({
    providedIn: 'root',
})
export class R_Security implements I_SecurityRepository {
    public INVALID_CHARS: string[] = [
        // forbidden characters for username
        '!',
        '§',
        '$',
        '%',
        '&',
        '/',
        '(',
        ')',
        '=',
        '?',
        '<',
        '>',
        '|',
        '.',
        ',',
        ';',
        '-',
        '#',
        '+',
        '*',
        '~',
        '^',
        '°',
        ' ',
    ];
    constructor() { }

    public validateMediaURL = (mediaURL: string): boolean => {
        const shortenedURL: string = mediaURL.trim();

        if (shortenedURL.length < 1) {
            return false;
        }

        if (!Number(shortenedURL)) {
            return false;
        }

        return true;
    };

    public isValidUserName = (username: string): boolean => {
        for (const char of this.INVALID_CHARS) {
            if (username.trim().includes(char)) {
                return false;
            }
        }

        return true;
    };
}
