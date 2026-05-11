export interface TracklistSearchResponseDto {
    id: number;
    tracklistName: string;
    mediaName: string;
    mediaOriginalName: string;
    mediaType: string;
    seasonNumber: number | null;
    customSeasonNumber: number | null;
}
