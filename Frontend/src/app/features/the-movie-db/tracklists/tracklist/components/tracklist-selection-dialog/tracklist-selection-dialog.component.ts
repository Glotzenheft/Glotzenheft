import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, finalize, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';

import {TracklistService} from '../../services/tracklist.service';
import {TracklistSearchResponseDto} from '../../models/response/tracklist-search-response.dto';
import {TracklistSearchPaginatedResponseDto} from '../../models/response/tracklist-search-paginated-response.dto';

@Component({
    selector: 'app-tracklist-selection-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,
        ProgressSpinnerModule,
        TooltipModule,
        AccordionModule
    ],
    standalone: true,
    templateUrl: './tracklist-selection-dialog.component.html',
    styleUrl: './tracklist-selection-dialog.component.css',
})
export class TracklistSelectionDialogComponent implements OnInit {
    private tracklistService = inject(TracklistService);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private destroy$ = new Subject<void>();

    // --- Signals for State Management ---
    public searchControl = new FormControl('');
    public isLoading = signal(false);
    public showOriginalName = signal(false);
    public hasSearched = signal(false);

    public page = signal(1);
    public totalPages = signal(0);
    public totalResults = signal(0);
    public hasMoreResults = computed(() => this.page() < this.totalPages());

    // Master list of all selected tracklists across searches
    public selectedTracklists = signal<TracklistSearchResponseDto[]>([]);

    // Holds the latest results from the backend
    private searchResults = signal<TracklistSearchResponseDto[]>([]);

    // Holds the selection from the *current* table view
    public currentSelection: TracklistSearchResponseDto[] = [];

    private existingTracklistIds = new Set<number>();

    // --- Computed Signals for UI Logic ---

    // Filters out already selected items from the new search results to avoid duplicates in the main table
    public availableTracklists = computed(() => {
        const selectedIds = new Set(this.selectedTracklists().map(t => t.id));
        return this.searchResults().filter(result => !selectedIds.has(result.id));
    });

    public emptyMessage = computed(() => {
        if (!this.hasSearched()) {
            return 'Bitte gib einen Suchbegriff ein, um Tracklisten zu finden.';
        }
        if (this.totalResults() === 0) {
            return 'Keine Tracklisten mit diesem Suchbegriff gefunden.';
        }
        if (this.availableTracklists().length === 0) {
            return 'Alle gefundenen Tracklisten wurden bereits hinzugefügt.';
        }
        return 'Keine Tracklisten verfügbar.';
    });

    ngOnInit(): void {
        this.setupSearchDebounce();

        // Pre-select tracklists that might have been passed into the dialog
        if (this.dialogConfig.data?.preselectedTracklists) {
            this.selectedTracklists.set(this.dialogConfig.data.preselectedTracklists);
        }

        if (this.dialogConfig.data?.existingTracklistIds) {
            this.existingTracklistIds = new Set<number>(this.dialogConfig.data.existingTracklistIds);
        }
    }

    private setupSearchDebounce(): void {
        this.searchControl.valueChanges.pipe(
            debounceTime(400), // Wait for 400ms of inactivity
            distinctUntilChanged(), // Only fire if the value has changed
            tap(query => {
                if (!query || query.length < 2) {
                    this.hasSearched.set(false);
                    this.searchResults.set([]);
                    this.totalResults.set(0);
                    this.page.set(1);
                    this.totalPages.set(0);
                }
            }),
            filter(query => !!query && query.length > 1), // Only search for queries with 2+ chars
            tap(() => {
                this.isLoading.set(true);
                this.searchResults.set([]); // Clear previous results
                this.page.set(1);
                this.totalPages.set(0);
                this.totalResults.set(0);
            }),
            switchMap(query =>
                this.tracklistService.search(query!, 1).pipe(
                    finalize(() => this.isLoading.set(false))
                )
            ),
            takeUntil(this.destroy$)
        ).subscribe(results => {
            this.hasSearched.set(true);
            this.handleSearchResponse(results, true);
        });
    }

    public loadMore(): void {
        if (!this.hasMoreResults()) return;
        const nextPage = this.page() + 1;
        const query = this.searchControl.value;
        if (!query) return;

        this.isLoading.set(true);
        this.tracklistService.search(query, nextPage).pipe(
            takeUntil(this.destroy$),
            finalize(() => this.isLoading.set(false))
        ).subscribe(response => {
            this.handleSearchResponse(response, false);
        });
    }

    private handleSearchResponse(response: TracklistSearchPaginatedResponseDto, isNewSearch: boolean): void {
        // Filter out tracklists that are already attached to the tag
        const newResults = response.results.filter(r => !this.existingTracklistIds.has(r.id));

        if (isNewSearch) {
            this.searchResults.set(newResults);
            this.currentSelection = [];
        } else {
            this.searchResults.update(curr => [...curr, ...newResults]);
        }

        this.page.set(response.page);
        this.totalPages.set(response.total_pages);
        this.totalResults.set(response.total_results);
    }

    // --- Table and Selection Methods ---

    public onSelectionChange(selectedItems: TracklistSearchResponseDto[]): void {
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

    // --- Dialog Action Methods ---

    public confirmSelection(): void {
        this.dialogRef.close(this.selectedTracklists());
    }

    public cancel(): void {
        this.dialogRef.close(null);
    }
}
