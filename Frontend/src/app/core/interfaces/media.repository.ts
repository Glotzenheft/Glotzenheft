/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Film, MediaIDResponse, Season, UpdateTracklistRequest } from "../../shared/interfaces/media-interfaces";
import { CreateMovieTracklistData, CreateSeasonTracklistData, Tracklist } from "../../shared/interfaces/tracklist-interfaces";
import { InjectionToken } from "@angular/core";

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
    getAllUserTracklists: () => Observable<Tracklist[]> | null
}

// IT = Injection Token
export const IT_MEDIA_REPOSITORY = new InjectionToken<I_MediaRepository>("I_MediaRepository")