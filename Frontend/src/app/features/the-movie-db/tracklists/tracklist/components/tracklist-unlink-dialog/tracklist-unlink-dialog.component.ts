import {Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';
import {TracklistTracklistTagResponseDto} from '../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tracklist-tag-response.dto';

@Component({
    selector: 'app-tracklist-unlink-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        TooltipModule,
        AccordionModule
    ],
    standalone: true,
    templateUrl: './tracklist-unlink-dialog.component.html',
    styleUrl: './tracklist-unlink-dialog.component.css'
})
export class TracklistUnlinkDialogComponent implements OnInit, OnDestroy {
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private destroy$ = new Subject<void>();

    public searchControl = new FormControl('');
    public searchQuery = signal('');
    public showOriginalName = signal(false);

    private allTracklists = signal<TracklistTracklistTagResponseDto[]>([]);
    public selectedTracklists = signal<TracklistTracklistTagResponseDto[]>([]);
    public currentSelection: TracklistTracklistTagResponseDto[] = [];

    public availableTracklists = computed(() => {
        const filterValue = this.searchQuery().toLowerCase();
        let results = this.allTracklists();
        
        if (filterValue) {
            results = results.filter(tracklist =>
                tracklist.tracklistName?.toLowerCase().includes(filterValue) ||
                tracklist.mediaName?.toLowerCase().includes(filterValue) ||
                tracklist.mediaOriginalName?.toLowerCase().includes(filterValue)
            );
        }
        
        const selectedIds = new Set(this.selectedTracklists().map(t => t.id));
        return results.filter(result => !selectedIds.has(result.id));
    });

    ngOnInit(): void {
        if (this.dialogConfig.data?.tracklists) {
            this.allTracklists.set(this.dialogConfig.data.tracklists);
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

    public onSelectionChange(selectedItems: TracklistTracklistTagResponseDto[]): void {
        if (selectedItems && selectedItems.length > 0) {
            this.selectedTracklists.update(current => {
                const existingIds = new Set(current.map(c => c.id));
                const newItems = selectedItems.filter(item => !existingIds.has(item.id));
                return [...current, ...newItems];
            });
            this.currentSelection = [];
        }
    }

    public removeFromSelection(tracklistId: number): void {
        this.selectedTracklists.update(
            current => current.filter(t => t.id !== tracklistId)
        );
        this.currentSelection = this.currentSelection.filter(t => t.id !== tracklistId);
    }

    public toggleSelectAll(): void {
        const available = this.availableTracklists();
        if (available.length > 0) {
            this.onSelectionChange(available);
        }
    }

    public confirm(): void {
        this.dialogRef.close(this.selectedTracklists());
    }

    public cancel(): void {
        this.dialogRef.close(null);
    }
}
