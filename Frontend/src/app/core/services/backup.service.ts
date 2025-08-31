import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Backup } from '../models/backup.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = `${environment.apiUrl}/backups`;

  constructor(private http: HttpClient) { }

  getBackups(): Observable<Backup[]> {
    return this.http.get<Backup[]>(this.apiUrl);
  }

  createBackup(): Observable<void> {
    return this.http.post<void>(this.apiUrl, {});
  }

  uploadBackup(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('backupFile', file, file.name);

    return this.http.post(`${this.apiUrl}/import`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadBackup(backupId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${backupId}/download`, {
      responseType: 'blob'
    });
  }
}
