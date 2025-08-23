export interface I_Recommendation {
    title: string, tmdb_id: number, media_type: string, poster_path: string
}

export interface I_Recommendations {
    recommendation1: I_Recommendation[],
    recommendation2: I_Recommendation[],
    recommendation3: I_Recommendation[]
}

export interface I_HighestRecommendations {
    recommendations: I_Recommendation[]
}