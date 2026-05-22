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
}
