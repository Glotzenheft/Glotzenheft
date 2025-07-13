/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
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
