export interface CreateTracklistEpisodeRequestDto {
    tracklist_id: number;
    tracklist_season_id: number;
    episode_id: number;
    watch_date_time?: string | null;
}
