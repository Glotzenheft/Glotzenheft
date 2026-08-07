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
