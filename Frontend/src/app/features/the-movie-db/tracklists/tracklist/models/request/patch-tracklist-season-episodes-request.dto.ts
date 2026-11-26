export type TracklistSeasonEpisodeState =
    | { episode_id: number; watched: true; watch_date_time: string | null }
    | { episode_id: number; watched: false };

export interface PatchTracklistSeasonEpisodesRequestDto {
    episodes: TracklistSeasonEpisodeState[];
}
