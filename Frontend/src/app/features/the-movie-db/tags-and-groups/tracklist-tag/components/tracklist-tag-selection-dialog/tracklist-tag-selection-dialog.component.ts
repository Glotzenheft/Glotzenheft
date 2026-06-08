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

import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { TracklistTagService } from '../../services/tracklist-tag.service';
import { TracklistTagLightResponseDto } from '../../models/response/tracklist-tag-light-response.dto';
import {TracklistTagTypeLabelPipe} from '../../../../../../shared/pipes/tracklist-tags/tracklist-tag-type-label.pipe';

@Component({
    selector: 'app-tracklist-tag-selection-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        ProgressSpinnerModule,
        AccordionModule,
        TagModule,
        TracklistTagTypeLabelPipe
    ],
    standalone: true,
    templateUrl: './tracklist-tag-selection-dialog.component.html',
    styleUrl: './tracklist-tag-selection-dialog.component.css'
})
export class TracklistTagSelectionDialogComponent implements OnInit, OnDestroy {
    private tracklistTagService = inject(TracklistTagService);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private destroy$ = new Subject<void>();
    private messageService = inject(MessageService, { optional: true });

    public searchControl = new FormControl('');
    public searchQuery = signal('');
    public isLoading = signal(false);

    private allTags = signal<TracklistTagLightResponseDto[]>([]);
    public selectedTags = signal<TracklistTagLightResponseDto[]>([]);
    public currentSelection: TracklistTagLightResponseDto[] = [];
    private existingTagIds = new Set<number>();

    public availableTags = computed(() => {
        const query = this.searchQuery().toLowerCase();
        let results = this.allTags();

        if (query) {
            results = results.filter(tag => tag.tagName.toLowerCase().includes(query));
        }

        const selectedIds = new Set(this.selectedTags().map(t => t.id));
        return results.filter(result => !selectedIds.has(result.id) && !this.existingTagIds.has(result.id));
    });

    ngOnInit(): void {
        if (this.dialogConfig.data?.existingTagIds) {
            this.existingTagIds = new Set<number>(this.dialogConfig.data.existingTagIds);
        }

        this.searchControl.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(value => {
            this.searchQuery.set(value || '');
        });

        this.loadTags();
    }

    private loadTags(): void {
        this.isLoading.set(true);
        this.tracklistTagService.getAllTags().pipe(
            finalize(() => this.isLoading.set(false)),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (tags) => {
                const sortedTags = tags.sort((a, b) => (a.tagName || '').localeCompare(b.tagName || ''));
                this.allTags.set(sortedTags);
            },
            error: () => {
                this.allTags.set([]);
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSelectionChange(selectedItems: TracklistTagLightResponseDto[]): void {
        if (selectedItems && selectedItems.length > 0) {
            this.selectedTags.update(current => {
                const existingIds = new Set(current.map(c => c.id));
                const newItems = selectedItems.filter(item => !existingIds.has(item.id));
                return [...current, ...newItems];
            });
            this.currentSelection = [];
        }
    }

    public removeFromSelection(tagId: number): void {
        this.selectedTags.update(current => current.filter(t => t.id !== tagId));
        this.currentSelection = this.currentSelection.filter(t => t.id !== tagId);
    }

    public toggleSelectAll(): void {
        const available = this.availableTags();
        if (available.length > 0) {
            this.onSelectionChange(available);
        }
    }

    public confirmSelection(): void {
        this.dialogRef.close(this.selectedTags());
    }

    public cancel(): void {
        this.dialogRef.close(null);
    }

    public async pasteIdsFromClipboard(): Promise<void> {
        try {
            const text = await navigator.clipboard.readText();
            if (!text) {
                this.messageService?.add({ severity: 'info', summary: 'Info', detail: 'Zwischenablage ist leer.' });
                return;
            }

            const matches = text.match(/\d+/g);
            if (!matches || matches.length === 0) {
                this.messageService?.add({ severity: 'warn', summary: 'Warnung', detail: 'Keine gültigen IDs in der Zwischenablage gefunden.' });
                return;
            }

            const ids = matches.map(id => parseInt(id, 10));
            const tagsToAdd = this.allTags().filter(tag => ids.includes(tag.id) && !this.existingTagIds.has(tag.id));

            if (tagsToAdd.length > 0) {
                this.onSelectionChange(tagsToAdd);
                this.messageService?.add({ severity: 'success', summary: 'Erfolg', detail: `${tagsToAdd.length} Tags eingefügt und ausgewählt.` });
            } else {
                this.messageService?.add({ severity: 'info', summary: 'Info', detail: 'Keine passenden Tags zu den IDs gefunden oder Tags sind bereits ausgewählt.' });
            }
        } catch (err) {
            console.error('Fehler beim Lesen der Zwischenablage:', err);
            this.messageService?.add({ severity: 'error', summary: 'Fehler', detail: 'Konnte nicht auf die Zwischenablage zugreifen.' });
        }
    }
}
