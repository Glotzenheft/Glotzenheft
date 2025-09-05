import { Observable } from "rxjs";
import { I_Backup } from "../../shared/interfaces/backup-interfaces";
import { InjectionToken } from "@angular/core";

export interface I_BackupRepository {
    getBackups: () => Observable<I_Backup[]>,
    createBackup: () => Observable<void>;
    uploadBackup: (file: File) => Observable<any>,
    downloadBackup: (backupId: number) => Observable<Blob>
}

// IT = Injection Token
export const IT_BACKUP_REPOSITORY = new InjectionToken<I_BackupRepository>("I_BackupRepository");