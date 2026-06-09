import { CreateTracklistEpisodeRequestDto } from './create-tracklist-episode-request.dto';

export interface CreateBulkTracklistEpisodeRequestDto {
    episodes: CreateTracklistEpisodeRequestDto[];
}
