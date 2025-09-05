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

import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { ROUTE_BACKUP, ROUTE_BACKUP_DOWNLOAD, ROUTE_BACKUP_IMPORT } from "../../shared/variables/api-routes";
import { isPlatformBrowser } from '@angular/common';
import { KEY_LOCAL_STORAGE_LAST_AUTH_TOKEN } from '../../shared/variables/local-storage-keys';
import { I_Backup} from "../../shared/interfaces/backup-interfaces";
import { I_BackupRepository } from '../../core/interfaces/backup.repository';

@Injectable({
    providedIn: 'root'
})
export class R_BackupHttp implements I_BackupRepository {

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {}

    private getHeader = (): HttpHeaders | null => {
        let userToken: string = '';

        if (isPlatformBrowser(this.platformId)) {
            userToken =
                localStorage.getItem(KEY_LOCAL_STORAGE_LAST_AUTH_TOKEN) ?? '';
        }

        if (!userToken.trim()) {
            return null;
        }

        return new HttpHeaders({
            Authorization: `Bearer ${userToken}`,
        });
    };

    public getBackups = (): Observable<I_Backup[]> => {
        const headers = this.getHeader();
        if (!headers) return EMPTY;
        return this.http.get<I_Backup[]>(ROUTE_BACKUP, { headers: headers });
    }

    public createBackup = (): Observable<void> => {
        const headers = this.getHeader();
        if (!headers) return EMPTY;
        return this.http.post<void>(ROUTE_BACKUP, {}, { headers: headers });
    }

    public uploadBackup = (file: File): Observable<any> => {
        const headers = this.getHeader();
        if (!headers) return EMPTY;

        const formData = new FormData();
        formData.append('backupFile', file, file.name);

        return this.http.post(ROUTE_BACKUP_IMPORT, formData, {
            headers: headers,
            reportProgress: true,
            observe: 'events'
        });
    }

    public downloadBackup = (backupId: number): Observable<Blob> => {
        const headers = this.getHeader();
        if (!headers) return EMPTY;

        const url = `${ROUTE_BACKUP_DOWNLOAD}?backup_id=${backupId}`;
        return this.http.get(url, {
            headers: headers,
            responseType: 'blob'
        });
    }
}