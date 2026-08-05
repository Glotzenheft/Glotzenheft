import {MediaLightDetailResponseDto} from './media-light-detail-response.dto';
import {MediaSeasonDetailResponseDto} from './media-season-detail-response.dto';
import {TmdbGenreResponseDto} from '../../../the-movie-db/genre/models/response/tmdb-genre-response.dto';

export interface MediaDetailDataResponseDto extends MediaLightDetailResponseDto {
    tmdbId: number;
    imdbId: string | null;
    originalName: string;
    name: string;
    description: string;
    firstAirDate: string | null;
    backdropPath: string | null;
    runtime: number | null;
    seasons: MediaSeasonDetailResponseDto[];
    tmdbGenres: TmdbGenreResponseDto[];
}
