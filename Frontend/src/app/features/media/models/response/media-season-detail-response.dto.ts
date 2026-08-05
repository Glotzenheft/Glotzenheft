import {MediaSeasonLightDetailResponseDto} from './media-season-light-detail-response.dto';
import {MediaSeasonEpisodeDetailResponseDto} from './media-season-episode-detail-response.dto';

export interface MediaSeasonDetailResponseDto extends MediaSeasonLightDetailResponseDto {
    tmdbSeasonId: number;
    name: string;
    overview: string;
    airDate: string | null;
    episodeCount: number;
    posterPath: string | null;
    episodes: MediaSeasonEpisodeDetailResponseDto[];
}
