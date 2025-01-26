import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StringService {
  constructor() {}

  shortenString = (str: string): string => {
    return `${str.substring(0, 20)}...`;
  };
}
