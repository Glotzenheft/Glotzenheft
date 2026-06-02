import {Pipe, PipeTransform} from '@angular/core';
import {TMDB_IMAGE_URLS} from '../../../core/constants/urls.constants';

type TmdbImageSize = keyof Omit<typeof TMDB_IMAGE_URLS, 'baseUrl'>;

@Pipe({
    name: 'tmdbImage',
    standalone: true
})
export class TmdbImagePipe implements PipeTransform {
    transform(path: string | null | undefined, sizeKey: TmdbImageSize = 'w500PosterUrl'): string {
        if (!path) {
            return '';
        }

        const baseUrl = TMDB_IMAGE_URLS.baseUrl;
        const size = TMDB_IMAGE_URLS[sizeKey];
        return `${baseUrl}${size}/${path}`;
    }
}
