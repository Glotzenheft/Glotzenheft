import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';

import { TracklistTagLightResponseDto } from '../../models/response/tracklist-tag-light-response.dto';
import {TracklistTagTypeLabelPipe} from '../../../../../../shared/pipes/tracklist-tags/tracklist-tag-type-label.pipe';

@Component({
    selector: 'app-tracklist-tag-unlink-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        AccordionModule,
        TagModule,
        TracklistTagTypeLabelPipe
    ],
    standalone: true,
    templateUrl: './tracklist-tag-unlink-dialog.component.html',
    styleUrl: './tracklist-tag-unlink-dialog.component.css'
})
export class TracklistTagUnlinkDialogComponent implements OnInit, OnDestroy {
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private destroy$ = new Subject<void>();

    public searchControl = new FormControl('');
    public searchQuery = signal('');

    private allTags = signal<TracklistTagLightResponseDto[]>([]);
    public selectedTags = signal<TracklistTagLightResponseDto[]>([]);
    public currentSelection: TracklistTagLightResponseDto[] = [];

    public availableTags = computed(() => {
        const filterValue = this.searchQuery().toLowerCase();
        let results = this.allTags();

        if (filterValue) {
            results = results.filter(tag =>
                tag.tagName?.toLowerCase().includes(filterValue) ||
                tag.description?.toLowerCase().includes(filterValue)
            );
        }

        const selectedIds = new Set(this.selectedTags().map(t => t.id));
        return results.filter(result => !selectedIds.has(result.id));
    });

    ngOnInit(): void {
        if (this.dialogConfig.data?.tags) {
            const sortedTags = [...this.dialogConfig.data.tags].sort((a, b) => (a.tagName || '').localeCompare(b.tagName || ''));
            this.allTags.set(sortedTags);
        }

        this.searchControl.valueChanges.pipe(
            takeUntil(this.destroy$)
        ).subscribe(value => {
            this.searchQuery.set(value || '');
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

    public confirm(): void {
        this.dialogRef.close(this.selectedTags());
    }

    public cancel(): void {
        this.dialogRef.close(null);
    }
}
