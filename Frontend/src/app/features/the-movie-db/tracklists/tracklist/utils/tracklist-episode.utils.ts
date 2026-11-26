import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { TracklistSeasonDetailDataDto } from '../models/response/tracklist-season/tracklist-season-detail-data.dto';

export const EPISODE_REQUEST_TIMEOUT_MS = 30_000;

export function unknownEpisodeWriteResult(error: unknown): boolean {
    return (
        error instanceof TimeoutError ||
        (error instanceof HttpErrorResponse && [0, 408, 504].includes(error.status))
    );
}

export function inTracklistRange(number: number, season: TracklistSeasonDetailDataDto): boolean {
    return (
        (season.startEpisodeNumber === null || number >= season.startEpisodeNumber) &&
        (season.endEpisodeNumber === null || number <= season.endEpisodeNumber)
    );
}
