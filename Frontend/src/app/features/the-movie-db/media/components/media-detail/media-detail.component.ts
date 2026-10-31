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
    DestroyRef,
    effect,
    ElementRef,
    HostListener,
    inject,
    Input,
    OnChanges,
    PLATFORM_ID,
    signal,
    viewChild,
    WritableSignal
} from '@angular/core';
import {MediaDetailService} from '../../services/media-detail.service';
import {MediaDetailStateService} from '../../services/media-detail-state.service';
import {MediaResponse} from '../../models/response/media-response.dto';
import {HttpErrorResponse} from '@angular/common/http';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subscription} from 'rxjs';
import {MEDIA_DETAILS_PATHS} from '../../../../../core/constants/paths.constants';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {Tab, TabList, Tabs} from 'primeng/tabs';
import {Tooltip} from 'primeng/tooltip';
import {Button} from 'primeng/button';
import {Image} from 'primeng/image';
import { Carousel } from 'primeng/carousel';
import {DecimalPipe, DOCUMENT, isPlatformBrowser, NgOptimizedImage} from '@angular/common';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {ProgressSpinner} from 'primeng/progressspinner';
import {
    TMDB_BACKDROP_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
    TMDB_POSTER_PATH
} from '../../../../../shared/variables/tmdb-vars';
import {MediaType} from '../../models/enums/media-type.enum';
import {Panel} from 'primeng/panel';
import {TMDB_MAIN_ROUTE} from '../../../../../shared/variables/tmdb-route';
import {Tag} from 'primeng/tag';
import {LanguageNamePipe} from '../../../../../shared/pipes/language-name/language-name.pipe';
import {RuntimePipe} from '../../../../../shared/pipes/runtime/runtime.pipe';
import {DollarCurrencyPipe} from '../../../../../shared/pipes/dollar-currency/dollar-currency.pipe';
import {
    DatetimeWithUnitFormattingPipe
} from '../../../../../shared/pipes/datetime-with-unit-formatting/datetime-with-unit-formatting.pipe';

@Component({
    selector: 'app-media-detail',
    imports: [
        RouterOutlet,
        Tab,
        TabList,
        Tabs,
        Tooltip,
        Button,
        Image,
        NgOptimizedImage,
        DecimalPipe,
        PrimeTemplate,
        ProgressSpinner,
        Panel,
        Tag,
        LanguageNamePipe,
        RuntimePipe,
        DollarCurrencyPipe,
        Carousel,
        DatetimeWithUnitFormattingPipe
    ],
    providers: [MediaDetailStateService],
    standalone: true,
    templateUrl: './media-detail.component.html',
    styleUrl: './media-detail.component.css'
})
export class MediaDetailComponent implements OnChanges{
    private mediaDetailService: MediaDetailService = inject(MediaDetailService);
    private router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private mediaSubscription?: Subscription;
    private route = inject(ActivatedRoute);
    private readonly document = inject(DOCUMENT);
    private readonly platformId = inject(PLATFORM_ID);
    private readonly messageService = inject(MessageService);
    private copyResetTimeout?: ReturnType<typeof setTimeout>;

    protected readonly originalPosterPath = TMDB_ORIGINAL_IMAGE_PATH;
    protected readonly posterPath = TMDB_POSTER_PATH;
    protected readonly backdropPath = TMDB_BACKDROP_PATH;
    protected readonly tmdbMediaUrl: string = TMDB_MAIN_ROUTE;
    protected readonly mediaTypes = MediaType;
    protected readonly boxPages = ['info', 'meta'];
    protected readonly barPages = ['genres', 'links'];

    @Input() mediaId!: string;
    @Input({alias: 'mediaType'}) mediaTypeUrlParam!: string;


    public state = inject(MediaDetailStateService);

    activeTab: WritableSignal<string> = signal<string>('tracklists');
    paths = MEDIA_DETAILS_PATHS;

    showOriginalTitle = signal<boolean>(false);
    mediaTitleElement = viewChild<ElementRef<HTMLHeadingElement>>('mediaTitleElement');
    isTooltipDisabled = signal<boolean>(true);
    imageError = signal<boolean>(false);
    isThumbnailLoading = signal<boolean>(true);
    isTitleCopied = signal<boolean>(false);

    constructor() {
        effect(() => {
            if (this.mediaTitleElement()) {
                setTimeout(() => this.checkTruncation())
            }
        })

        this.destroyRef.onDestroy(() => clearTimeout(this.copyResetTimeout));
    }

    ngOnChanges(): void {
        this.loadMedia();
    }

    loadMedia(): void {
        this.mediaSubscription?.unsubscribe();
        this.state.startLoading();
        this.imageError.set(false);
        this.isThumbnailLoading.set(true);
        this.showOriginalTitle.set(false);

        const id = Number(this.mediaId);
        if (
            !Number.isSafeInteger(id) ||
            id <= 0 ||
            (this.mediaTypeUrlParam !== MediaType.MOVIE && this.mediaTypeUrlParam !== MediaType.TV_SHOW)
        ) {
            this.state.setLoadError('Die Medienadresse ist ungültig.');
            return;
        }

        this.mediaSubscription = this.mediaDetailService
            .getMedia(this.mediaTypeUrlParam, id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (media: MediaResponse) => this.state.setMedia(media),
                error: (error: unknown) => {
                    const message =
                        error instanceof HttpErrorResponse && error.status === 401
                            ? 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.'
                            : error instanceof HttpErrorResponse && error.status === 404
                              ? 'Das Medium wurde nicht gefunden.'
                              : 'Das Medium konnte nicht geladen werden. Bitte versuche es erneut.';
                    this.state.setLoadError(message);
                },
            });
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

    async copyTitle(title: string | null | undefined): Promise<void> {
        const text = title?.trim();
        if (!text || !isPlatformBrowser(this.platformId)) {
            return;
        }

        const success = await this.writeToClipboard(text);

        if (success) {
            this.isTitleCopied.set(true);
            clearTimeout(this.copyResetTimeout);
            this.copyResetTimeout = setTimeout(() => this.isTitleCopied.set(false), 2000);
            this.messageService.add({ severity: 'success', summary: 'Kopiert', detail: `"${text}" wurde in die Zwischenablage kopiert.` });
        } else {
            this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Der Titel konnte nicht in die Zwischenablage kopiert werden.' });
        }
    }

    private async writeToClipboard(text: string): Promise<boolean> {
        const clipboard = this.document.defaultView?.navigator?.clipboard;
        if (clipboard?.writeText && this.document.defaultView?.isSecureContext) {
            try {
                await clipboard.writeText(text);
                return true;
            } catch {}
        }
        return this.legacyCopyToClipboard(text);
    }

    private legacyCopyToClipboard(text: string): boolean {
        const textarea = this.document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        this.document.body.appendChild(textarea);

        const activeElement = this.document.activeElement as HTMLElement | null;
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, text.length);

        let success = false;
        try {
            success = this.document.execCommand('copy');
        } catch {
            success = false;
        } finally {
            this.document.body.removeChild(textarea);
            activeElement?.focus();
        }

        return success;
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

    protected getPopularityLabel(popularity: number): string {
        if (popularity >= 500) {
            return 'Im Trend';
        }
        if (popularity >= 100) {
            return 'Sehr beliebt';
        }
        if (popularity >= 30) {
            return 'Beliebt';
        }
        return 'Eher unbekannt';
    }

    public handleImageError() {
        this.isThumbnailLoading.set(false);
        this.imageError.set(true);
    }
}
