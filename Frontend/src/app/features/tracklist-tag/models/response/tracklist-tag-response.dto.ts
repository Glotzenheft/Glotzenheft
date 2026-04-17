import {TracklistTracklistTagResponseDto} from './tracklist-tracklist-tag-response.dto';
import {TracklistTagLightResponseDto} from './tracklist-tag-light-response.dto';

export interface TracklistTagResponseDto extends TracklistTagLightResponseDto {
    tracklists: TracklistTracklistTagResponseDto[];
}
