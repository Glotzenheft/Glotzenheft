import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringService {
  constructor() {}

  shortenString = (str: string): string => {
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
