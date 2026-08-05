import {MediaSeasonEpisodeLightDetailResponse} from './media-season-episode-light-detail-response.dto';

export interface MediaSeasonEpisodeDetailResponseDto extends MediaSeasonEpisodeLightDetailResponse {
    tmdbEpisodeId: number;
    name: string;
    overview: string;
    episodeNumber: number;
    runtime: number | null;
    stillPath: string | null;
    airDate: string | null;
}
