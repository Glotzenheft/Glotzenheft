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
import {MediaDetailService} from '../../services/media-detail.service';
import {MediaDetailStateService} from '../../services/media-detail-state.service';
import {MediaResponse} from '../../models/response/media-response.dto';
import {MEDIA_DETAILS_PATHS} from '../../../../../core/constants/paths.constants';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Tab, TabList, Tabs} from 'primeng/tabs';

@Component({
    selector: 'app-media-detail',
    imports: [
        RouterOutlet,
        Tab,
        TabList,
        Tabs
    ],
    providers: [MediaDetailStateService],
    standalone: true,
    templateUrl: './media-detail.component.html',
    styleUrl: './media-detail.component.css'
})
export class MediaDetailComponent implements OnInit{
    private mediaDetailService: MediaDetailService = inject(MediaDetailService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    @Input() mediaId!: string;
    @Input() mediaType!: string;


    public state = inject(MediaDetailStateService);

    activeTab: WritableSignal<string> = signal<string>('tracklists');
    paths = MEDIA_DETAILS_PATHS;

    ngOnInit(): void {
        this.loadMedia();
    }

    private loadMedia(): void {
        this.state.isLoading.set(true);
        this.mediaDetailService.getMedia(this.mediaType, Number(this.mediaId)).subscribe({
            next: (media: MediaResponse) => {
                this.state.mediaData.set(media);
                this.state.isLoading.set(false);
            },
            error: (err) => {
                console.error('Fehler beim Laden der Medien!', err);
                this.state.isLoading.set(false);
            }
        })
    }

    onTabChange(newRoute: string | number): void {
        const routeStr = newRoute.toString();
        this.activeTab.set(routeStr);
        void this.router.navigate([routeStr], { relativeTo: this.route });
    }
}
