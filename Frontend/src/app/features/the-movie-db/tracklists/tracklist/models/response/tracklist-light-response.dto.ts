import {TracklistStatusEnum} from '../enums/tracklist-status.enum';
import {MediaLightDetailResponseDto} from '../../../../../media/models/response/media-light-detail-response.dto';
import {
    TracklistTagLightResponseDto
} from '../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';

export interface TracklistLightResponseDto {
    id: number;
    tracklistName: string;
    createdAt: string;
    updatedAt: string | null;
    status: TracklistStatusEnum;
    rating: number | null;
    isRewatching: boolean;
    startDate: string | null;
    finishDate: string | null;
    customAirDate: string | null;
    language: string | null;
    subtitle: string | null;
    customPosterPath: string | null;
    media: MediaLightDetailResponseDto;
    tags: TracklistTagLightResponseDto[];
}
