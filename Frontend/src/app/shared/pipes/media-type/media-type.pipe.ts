import {Pipe, PipeTransform} from '@angular/core';
import {MediaType} from '../../../features/media/models/media-type.enum';

@Pipe({
    name: 'mediaType'
})
export class MediaTypePipe implements PipeTransform {

    transform(value: MediaType | string | null | undefined, ...args: unknown[]): string {
        switch (value) {
            case MediaType.MOVIE:
                return 'Film';
            case MediaType.TV_SHOW:
                return 'Serie';
            default:
                return value ? String(value) : '';
        }
    }
}
