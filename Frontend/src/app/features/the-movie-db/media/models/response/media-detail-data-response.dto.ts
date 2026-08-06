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
    originalName: string;
    name: string;
    description: string;
    firstAirDate: string | null;
    backdropPath: string | null;
    runtime: number | null;
    seasons: MediaSeasonDetailResponseDto[];
    tmdbGenres: TmdbGenreResponseDto[];
}
