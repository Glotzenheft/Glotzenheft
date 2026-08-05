import {MediaDetailDataResponseDto} from './media-detail-data-response.dto';
import {TracklistResponseDto} from '../../../the-movie-db/tracklists/tracklist/models/response/tracklist-response.dto';

export interface MediaResponse {
    media: MediaDetailDataResponseDto;
    tracklists: TracklistResponseDto[];
}
