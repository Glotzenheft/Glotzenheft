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

    if (!Number(shortenedURL)) {
      return false;
    }

    return true;
  };

  public isValidUsername = (username: string): boolean => {
    console.log(username);

    for (const char of this.INVALID_CHARS) {
      if (username.trim().includes(char)) {
        return false;
      }
    }

    return true;
  };
}
