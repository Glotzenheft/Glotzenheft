import { Injectable, signal } from '@angular/core';
import { TracklistTagResponseDto } from '../models/response/tracklist-tag-response.dto';

@Injectable()
export class TracklistTagDetailStateService {
    tagData = signal<TracklistTagResponseDto | null>(null);
    isLoading = signal<boolean>(true);
}
