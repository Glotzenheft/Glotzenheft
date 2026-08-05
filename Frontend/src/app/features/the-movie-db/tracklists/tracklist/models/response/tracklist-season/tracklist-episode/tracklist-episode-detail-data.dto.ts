import {
    MediaSeasonEpisodeLightDetailResponse
} from '../../../../../../../media/models/response/media-season-episode-light-detail-response.dto';

export interface TracklistEpisodeDetailDataDto {
    id: number;
    createdAt: string;
    updatedAt: string | null;
    watchDateTime: string | null;
    episode: MediaSeasonEpisodeLightDetailResponse;
}
