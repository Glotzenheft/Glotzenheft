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
