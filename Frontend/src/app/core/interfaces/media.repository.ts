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