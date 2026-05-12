import { TracklistSearchResponseDto } from './tracklist-search-response.dto';

export interface TracklistSearchPaginatedResponseDto {
    results: TracklistSearchResponseDto[];
    page: number;
    total_results: number;
    total_pages: number;
}
