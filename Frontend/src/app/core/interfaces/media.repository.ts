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

import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Film, MediaIDResponse, Season, UpdateTracklistRequest } from "../../shared/interfaces/media-interfaces";
import { CreateMovieTracklistData, CreateSeasonTracklistData, Tracklist } from "../../shared/interfaces/tracklist-interfaces";
import { InjectionToken } from "@angular/core";
import { I_APIRecommendationResponse, I_HighestRecommendations, I_Recommendation, I_Recommendations } from "../../shared/interfaces/recommendation-interfaces";

export interface I_MediaRepository {
    getHeader: () => HttpHeaders | null,
    getAllFilms: () => Observable<Film[]>,
    getMediaIdForMedia: (tmdbID: number, isMovie: boolean) => Observable<MediaIDResponse>,
    getSeasonForTV: (mediaID: string) => Observable<Season> | null,
    getFilmDetails: (movieID: string) => Observable<Film> | null,
    getMultiSearchResults: (searchString: string, page: number) => Observable<any>,
    triggerTracklistCREATESEASONSubject: (tracklistData: CreateSeasonTracklistData) => void,
    getTracklistCREATESEASONResponseSubject: () => Observable<Tracklist>,
    createNewSeasonTracklist: (data: CreateSeasonTracklistData) => Observable<Tracklist>,
    triggerTracklistCREATEMOVIESubject: (tracklistData: CreateMovieTracklistData) => void,
    getTracklistCREATEMOVIESubjectResponse: () => Observable<any>,
    createNewMovieTracklist: (data: CreateMovieTracklistData) => Observable<any>,
    triggerTracklistUPDATESubject: (tracklistData: UpdateTracklistRequest) => void,
    getTracklistUPDATEResponseSubject: () => Observable<Tracklist>,
    updateTracklist: (tracklistData: UpdateTracklistRequest) => Observable<Tracklist>,
    triggerTracklistDELETESubject: (tracklistID: number) => void,
    getTracklistDELETEResponseSubject: () => Observable<any>,
    deleteTracklist: (tracklistID: number) => Observable<any>,
    getAllUserTracklists: () => Observable<Tracklist[]> | null,
    getRecommendations: (tmdbId: number, title: string, isMovie: boolean, posterPath: string) => Observable<I_Recommendations>,
    getAPIRecommendations: (tmdbId: number, isMovie: boolean) => Observable<I_APIRecommendationResponse | null>,
    getHighestRecommendations: () => Observable<I_HighestRecommendations>
}

// IT = Injection Token
export const IT_MEDIA_REPOSITORY = new InjectionToken<I_MediaRepository>(
    'I_MediaRepository',
);
