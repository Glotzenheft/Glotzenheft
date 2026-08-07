import {Injectable, signal} from '@angular/core';
import {MediaResponse} from '../models/response/media-response.dto';

@Injectable()
export class MediaDetailStateService {
    mediaData = signal<MediaResponse | null>(null);
    isLoading = signal<boolean>(true);
}
