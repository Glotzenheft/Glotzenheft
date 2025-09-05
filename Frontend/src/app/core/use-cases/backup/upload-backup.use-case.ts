import { Inject, Injectable } from "@angular/core";
import { I_BackupRepository, IT_BACKUP_REPOSITORY } from "../../interfaces/backup.repository";
import { Observable } from "rxjs";

@Injectable()
export class UC_UploadBackup {
    constructor(@Inject(IT_BACKUP_REPOSITORY) private readonly backupRepository: I_BackupRepository) {}

    public execute = (file: File): Observable<any> => {return this.backupRepository.uploadBackup(file);}
}