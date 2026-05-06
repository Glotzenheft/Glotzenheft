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
