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

import { Inject, Injectable } from '@angular/core';
import {
    I_BackupRepository,
    IT_BACKUP_REPOSITORY,
} from '../../interfaces/backup.repository';
import { Observable } from 'rxjs';

@Injectable()
export class UC_DownloadBackup {
    constructor(
        @Inject(IT_BACKUP_REPOSITORY)
        private readonly backupRepository: I_BackupRepository,
    ) {}

    public execute = (backupId: number): Observable<Blob> => {
        return this.backupRepository.downloadBackup(backupId);
    };
}
