import { Injectable } from '@angular/core';
import { I_StringRepository } from '../../core/interfaces/string.repository';

@Injectable({
    providedIn: 'root',
})
export class R_String implements I_StringRepository {
    constructor() { }

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
