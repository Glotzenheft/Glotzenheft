import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DialogService } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';

import { TracklistTagService } from '../../services/tracklist-tag.service';
import { TracklistTagLightResponseDto } from '../../models/response/tracklist-tag-light-response.dto';
import { TracklistTagType } from '../../models/tracklist-tag-type.enum';
import { TracklistTagTypeLabelPipe } from '../../../../../../shared/pipes/tracklist-tags/tracklist-tag-type-label.pipe';
import { TracklistTagFormDialogComponent } from '../tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { Tooltip } from 'primeng/tooltip';

interface TagGroup {
    type: TracklistTagType;
    tags: TracklistTagLightResponseDto[];
}

@Component({
    selector: 'app-tracklist-tag-overview',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TracklistTagTypeLabelPipe,
        Button,
        Tooltip
    ],
    providers: [ DialogService ],
    templateUrl: './tracklist-tag-overview.component.html',
    styleUrl: './tracklist-tag-overview.component.css'
})
export class TracklistTagOverviewComponent implements OnInit {
    private tracklistTagService = inject(TracklistTagService);
    private dialogService: DialogService = inject(DialogService);

    groupedTags = signal<TagGroup[]>([]);
    isLoading = signal<boolean>(true);

    ngOnInit(): void {
        this.loadTags();
    }

    loadTags(): void {
        this.isLoading.set(true);
        this.tracklistTagService.getAllTags().subscribe({
            next: (tags) => {
                this.groupedTags.set(this.buildFullTagGroups(tags));
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    private buildFullTagGroups(tagsFromServer: TracklistTagLightResponseDto[]): TagGroup[] {
        const allTypes = Object.values(TracklistTagType);

        return allTypes.map(type => {
            const filteredTags = tagsFromServer
                .filter(t => t.tracklistTagType === type)
                .sort((a, b) => a.tagName.localeCompare(b.tagName));

            return {
                type: type as TracklistTagType,
                tags: filteredTags
            };
        });
    }

    openCreateDialog(type: TracklistTagType): void {
        const ref = this.dialogService.open(TracklistTagFormDialogComponent, {
            header: 'Neuen Tag erstellen',
            modal: true,
            width: '50vw',
            closable: true,
            contentStyle: {
                overflow: 'auto'
            },
            breakpoints: {
                '960px': '75vw',
                '640px': '90vw'
            },
            data: {
                prefill: { type }
            }
        });

        ref.onClose.subscribe((result) => {
            if (result) {
                this.loadTags();
            }
        });
    }
}
