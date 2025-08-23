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
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Film, MediaIDResponse, Season, UpdateTracklistRequest } from "../../shared/interfaces/media-interfaces";
import { CreateMovieTracklistData, CreateSeasonTracklistData, Tracklist } from "../../shared/interfaces/tracklist-interfaces";
import { InjectionToken } from "@angular/core";
import { I_MovieRecommendations } from "../../shared/interfaces/movie-recommendation-interface";

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
    getRecommendations: (tmdbId: number, title: string, isMovie: boolean) => Observable<I_MovieRecommendations>
}

// IT = Injection Token
export const IT_MEDIA_REPOSITORY = new InjectionToken<I_MediaRepository>("I_MediaRepository")