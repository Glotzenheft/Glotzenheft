import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
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
  constructor() {}

  public validateMediaURL = (mediaURL: string): boolean => {
    const shortenedURL: string = mediaURL.trim();

    if (shortenedURL.length < 1) {
      return false;
    }

    const splittedURL: string[] = shortenedURL.split('_');

    if (splittedURL.length > 3 || splittedURL.length < 1) {
      return false;
    }


    if (splittedURL.length > 1 && splittedURL[2] === "") {}
    // if (!Number.isNaN(splittedURL[0].trim())) {
    //   // valid is a number = id of media
    //   return false;
    // }

    return true;
  };

  public isValidUsername = (username: string): boolean => {
    console.log(username);

    for (const char of this.INVALID_CHARS) {
      console.log('char', char);
      if (username.trim().includes(char)) {
        console.log('Char in if: ', char);
        return false;
      }
    }

    return true;
  };
}
