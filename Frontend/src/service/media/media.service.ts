import { Injectable } from '@angular/core';
import { Film } from '../../shared/interfaces/media-interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getAllFilms = (): Observable<Film[]> => {
    return this.http.get<Film[]>('');
  };
}
