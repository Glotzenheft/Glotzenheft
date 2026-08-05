import {TracklistLightResponseDto} from './tracklist-light-response.dto';
import {TracklistSeasonDetailDataDto} from './tracklist-season/tracklist-season-detail-data.dto';

export interface TracklistResponseDto extends TracklistLightResponseDto {
    comment: string | null;
    tracklistSeason: TracklistSeasonDetailDataDto | null;
}
