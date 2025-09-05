import { Inject, Injectable } from "@angular/core";
import { I_BackupRepository, IT_BACKUP_REPOSITORY } from "../../interfaces/backup.repository";
import { Observable } from "rxjs";
import { I_Backup } from "../../../shared/interfaces/backup-interfaces";

@Injectable()
export class UC_GetBackups {
    constructor (@Inject(IT_BACKUP_REPOSITORY) private readonly backupRepository: I_BackupRepository) {}

    public execute = (): Observable<I_Backup[]> => {return this.backupRepository.getBackups();}
}