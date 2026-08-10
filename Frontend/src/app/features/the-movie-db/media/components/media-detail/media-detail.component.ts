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

import {
    Component,
    effect,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnInit,
    signal,
    viewChild,
    WritableSignal
} from '@angular/core';
import {MediaDetailService} from '../../services/media-detail.service';
import {MediaDetailStateService} from '../../services/media-detail-state.service';
import {MediaResponse} from '../../models/response/media-response.dto';
import {MEDIA_DETAILS_PATHS} from '../../../../../core/constants/paths.constants';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Tab, TabList, Tabs} from 'primeng/tabs';
import {Tooltip} from 'primeng/tooltip';
import {Button} from 'primeng/button';

@Component({
    selector: 'app-media-detail',
    imports: [
        RouterOutlet,
        Tab,
        TabList,
        Tabs,
        Tooltip,
        Button
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

    showOriginalTitle = signal<boolean>(false);
    mediaTitleElement = viewChild<ElementRef<HTMLHeadingElement>>('mediaTitleElement');
    isTooltipDisabled = signal<boolean>(true);

    constructor() {
        effect(() => {
            if (this.mediaTitleElement()) {
                setTimeout(() => this.checkTruncation())
            }
        })
    }

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

    toggleTitle(): void {
        this.showOriginalTitle.update(current => !current);
        setTimeout(() => this.checkTruncation())
    }

    checkTruncation(): void {
        const element = this.mediaTitleElement()?.nativeElement;
        if (element) {
            const isTruncated = element.scrollWidth > element.clientWidth;
            this.isTooltipDisabled.set(!isTruncated);
        }
    }

    @HostListener('window:resize')
    onResize(): void {
        this.checkTruncation();
    }
}
