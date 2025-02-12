import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor() {}

  public validateMediaURL = (mediaURL: string): boolean => {
    const shortenedURL: string = mediaURL.trim();

    if (shortenedURL.length < 1) {
      return false;
    }

    const splittedURL: string[] = shortenedURL.split('_');
    // valid url of type:" <id>_<mediaGenre>", e. g. "123456_tv"

    if (splittedURL.length < 2) {
      return false;
    }

    if (splittedURL[1].trim() !== 'tv' && splittedURL[1].trim() !== 'movie') {
      // valid are only "tv" and "movie"
      return false;
    }

    if (!Number.isNaN(splittedURL[0].trim())) {
      // valid is a number = id of media
      return false;
    }

    return true;
  };
}
