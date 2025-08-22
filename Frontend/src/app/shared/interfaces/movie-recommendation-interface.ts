export interface I_MovieRecommendation {
    title: string, tmdb_id: number, media_type: string, poster_path: string
}

export interface I_MovieRecommendations {
    recommendation1: I_MovieRecommendation[],
    recommendation2: I_MovieRecommendation[],
    recommendation3: I_MovieRecommendation[]
}