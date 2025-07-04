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
