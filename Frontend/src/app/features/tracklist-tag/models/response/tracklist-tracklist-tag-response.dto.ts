import { MediaType} from '../../../media/models/media-type.enum';

export interface TracklistTracklistTagResponseDto {
    id: number;
    tracklistName: string;
    mediaId: number;
    mediaName: string;
    mediaOriginalName: string;
    mediaPosterPath: string;
    mediaType: MediaType;
}
