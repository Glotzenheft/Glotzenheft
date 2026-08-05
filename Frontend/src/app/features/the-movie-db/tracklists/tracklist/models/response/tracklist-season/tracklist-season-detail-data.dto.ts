import {
    MediaSeasonLightDetailResponseDto
} from '../../../../../../media/models/response/media-season-light-detail-response.dto';
import {TracklistEpisodeDetailDataDto} from './tracklist-episode/tracklist-episode-detail-data.dto';

export interface TracklistSeasonDetailDataDto {
    id: number;
    createdAt: string;
    updatedAt: string | null;
    startEpisodeNumber: number | null;
    endEpisodeNumber: number | null;
    customSeasonNumber: number | null;
    customPartNumber: number | null;
    season: MediaSeasonLightDetailResponseDto;
    tracklistEpisodes: TracklistEpisodeDetailDataDto[];
}
