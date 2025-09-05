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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import {R_BackupHttp} from "../../../../app/infrastructure/api/backup.service";
import { I_Backup} from "../../../../app/shared/interfaces/backup-interfaces";
import { UC_GetBackups } from '../../../../app/core/use-cases/backup/get-backups.use-case';
import { UC_CreateBackup } from '../../../../app/core/use-cases/backup/create-backup.use-case';
import { UC_UploadBackup } from '../../../../app/core/use-cases/backup/upload-backup.use-case';
import { UC_DownloadBackup } from '../../../../app/core/use-cases/backup/download-backup.use-case';

@Component({
    selector: 'app-backup-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './backup-page.component.html',
    styleUrls: ['./backup-page.component.css'],
    providers: [
        UC_CreateBackup,
        UC_DownloadBackup,
        UC_GetBackups,
        UC_UploadBackup
    ]
})
export class BackupPageComponent implements OnInit, OnDestroy {
    backups: I_Backup[] = [];
    selectedFile: File | null = null;
    uploadProgress = 0;
    isPolling = false;

    private destroy$ = new Subject<void>();
    private pollingSubscription: Subscription | null = null;

    constructor(
        private readonly getBackupsUseCase: UC_GetBackups,
        private readonly createBackupUseCase: UC_CreateBackup,
        private readonly uploadBackupUseCase: UC_UploadBackup,
        private readonly downloadBackupUseCase: UC_DownloadBackup
    ) { }

    ngOnInit(): void {
        this.loadBackups();
    }

    loadBackups(): void {
        this.getBackupsUseCase.execute()
            .pipe(takeUntil(this.destroy$))
            .subscribe((backups: I_Backup[]) => {
                this.backups = backups;
                const shouldPoll = backups.some((b: I_Backup) => b.status === 'pending' || b.status === 'processing');
                if (shouldPoll && !this.isPolling) {
                    this.startPolling();
                } else if (!shouldPoll && this.isPolling) {
                    this.stopPolling();
                }
            });
    }

    startPolling(): void {
        this.isPolling = true;
        this.pollingSubscription = timer(0, 5000).pipe( // Poll every 5 seconds
            switchMap(() => this.getBackupsUseCase.execute()),
            takeUntil(this.destroy$)
        ).subscribe((backups: I_Backup[]) => {
            this.backups = backups;
            if (!backups.some((b: I_Backup) => b.status === 'pending' || b.status === 'processing')) {
                this.stopPolling();
            }
        });
    }

    stopPolling(): void {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
            this.pollingSubscription = null;
        }
        this.isPolling = false;
    }

    createBackup(): void {
        this.createBackupUseCase.execute().pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.loadBackups(); // Refresh list immediately
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.uploadProgress = 0;
        }
    }

    uploadBackup(): void {
        if (!this.selectedFile) {
            return;
        }

        this.uploadBackupUseCase.execute(this.selectedFile).pipe(takeUntil(this.destroy$)).subscribe((event: HttpEvent<any>) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
            } else if (event.type === HttpEventType.Response) {
                this.selectedFile = null;
                this.uploadProgress = 0;
                this.loadBackups(); // Refresh list
            }
        });
    }

    downloadBackup(backupId: number): void {
        this.downloadBackupUseCase.execute(backupId).pipe(takeUntil(this.destroy$)).subscribe((blob: Blob) => {
            const backup = this.backups.find((b: I_Backup) => b.id === backupId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = backup?.filename ?? 'backup.json';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.stopPolling();
    }
}