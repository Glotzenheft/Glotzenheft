import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Backup } from '../models/backup.model';
import { ROUTE_BACKUPS, ROUTE_BACKUPS_DOWNLOAD, ROUTE_BACKUPS_IMPORT } from '../../shared/variables/api-routes';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  constructor(private http: HttpClient) { }

  getBackups(): Observable<Backup[]> {
    return this.http.get<Backup[]>(ROUTE_BACKUPS);
  }

  createBackup(): Observable<void> {
    return this.http.post<void>(ROUTE_BACKUPS, {});
  }

  uploadBackup(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('backupFile', file, file.name);

    return this.http.post(ROUTE_BACKUPS_IMPORT, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadBackup(backupId: number): Observable<Blob> {
    const url = `${ROUTE_BACKUPS_DOWNLOAD}${backupId}/download`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
}
