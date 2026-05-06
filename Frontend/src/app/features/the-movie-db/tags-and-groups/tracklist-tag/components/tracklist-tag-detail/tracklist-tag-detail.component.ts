import {Component, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TabsModule } from 'primeng/tabs';

import { TracklistTagService } from '../../services/tracklist-tag.service';
import { TracklistTagFormDialogComponent } from '../tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { TRACKLIST_TAG_URLS} from '../../../../../../core/constants/urls.constants';
import { TracklistTagTypeLabelPipe } from '../../../../../../shared/pipes/tracklist-tags/tracklist-tag-type-label.pipe';
import { TracklistTagDetailStateService } from '../../services/tracklist-tag-detail-state.service';
import {TRACKLIST_TAG_PATHS} from '../../../../../../core/constants/paths.constants';

@Component({
    selector: 'app-tracklist-tag-detail',
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TabsModule,
        TracklistTagTypeLabelPipe,
    ],
    providers: [
        DialogService,
        TracklistTagDetailStateService
    ],
    standalone: true,
    templateUrl: './tracklist-tag-detail.component.html',
    styleUrl: './tracklist-tag-detail.component.css'
})
export class TracklistTagDetailComponent implements OnInit{
    private tracklistTagService = inject(TracklistTagService);
    private dialogService = inject(DialogService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    @Input() tagId!: string;

    public state = inject(TracklistTagDetailStateService);

    activeTab: WritableSignal<string> = signal<string>('tracklists')
    paths = TRACKLIST_TAG_PATHS;

    ngOnInit(): void {
        this.loadTag();
    }

    private loadTag(): void {
        this.state.isLoading.set(true);
        this.tracklistTagService.getTagWithTracklists(Number(this.tagId)).subscribe({
            next: (tag) => {
                this.state.tagData.set(tag);
                this.state.isLoading.set(false);
            },
            error: (err) => {
                console.error('Fehler beim Laden des Tags', err);
                this.state.isLoading.set(false);
            }
        });
    }

    onTabChange(newRoute: string | number): void {
        const routeStr = newRoute.toString();
        this.activeTab.set(routeStr);
        void this.router.navigate([routeStr], { relativeTo: this.route });
    }

    openEditDialog(): void {
        const currentTag = this.state.tagData();
        if (!currentTag) return;

        const ref = this.dialogService.open(TracklistTagFormDialogComponent, {
            header: 'Tag bearbeiten',
            width: '500px',
            data: {
                tag: currentTag
            }
        });

        ref.onClose.subscribe((updatedTag) => {
            if (updatedTag) {
                this.loadTag();
            }
        });
    }

    deleteTag(): void {
        if(confirm('Möchtest du diesen Tag wirklich löschen?')) {
            this.tracklistTagService.deleteTag(Number(this.tagId)).subscribe({
                next: () => {
                    void this.router.navigate(['/', TRACKLIST_TAG_URLS.overview]);
                },
                error: (err) => console.error('Fehler beim Löschen', err)
            });
        }
    }
}
