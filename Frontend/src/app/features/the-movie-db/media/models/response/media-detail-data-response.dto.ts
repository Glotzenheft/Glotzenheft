/*
This file is part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import {MediaLightDetailResponseDto} from './media-light-detail-response.dto';
import {MediaSeasonDetailResponseDto} from './media-season-detail-response.dto';
import {TmdbGenreResponseDto} from '../../../genre/models/response/tmdb-genre-response.dto';

export interface MediaDetailDataResponseDto extends MediaLightDetailResponseDto {
    tmdbId: number;
    imdbId: string | null;
    tvdbId: number | null;
    wikidataId: string | null;
    facebookId: string | null;
    instagramId: string | null;
    twitterId: string | null;
    originalName: string;
    name: string;
    description: string;
    firstAirDate: string | null;
    backdropPath: string | null;
    runtime: number | null;
    adult: boolean;
    numberOfEpisodes: number | null;
    numberOfSeasons: number | null;
    originalLanguage: string;
    popularity: number;
    status: string | null;
    voteAverage: number;
    voteCount: number;
    homepage: string | null;
    tagline: string | null;
    budget: string;
    revenue: string;
    seasons: MediaSeasonDetailResponseDto[];
    tmdbGenres: TmdbGenreResponseDto[];
}
