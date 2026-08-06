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
    EventEmitter,
    input,
    InputSignal,
    computed,
    Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import {
    TVSeasonWithTracklist,
} from '../../../../app/shared/interfaces/tracklist-interfaces';
import {
    TMDB_POSTER_PATH,
    TMDB_ORIGINAL_IMAGE_PATH,
} from '../../../../app/shared/variables/tmdb-vars';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';
import {
    DecimalPipe,
    NgOptimizedImage
} from "@angular/common";
import { DatetimeWithUnitFormattingPipe } from '../../../../app/shared/pipes/datetime-with-unit-formatting/datetime-with-unit-formatting.pipe';
import {Image} from 'primeng/image';
import { MediaSeasonEpisodeDetailResponseDto } from "../../../../app/features/the-movie-db/media/models/response/media-season-episode-detail-response.dto";
import {
    TracklistResponseDto
} from '../../../../app/features/the-movie-db/tracklists/tracklist/models/response/tracklist-response.dto';
import {
    TracklistEpisodeDetailDataDto
} from '../../../../app/features/the-movie-db/tracklists/tracklist/models/response/tracklist-season/tracklist-episode/tracklist-episode-detail-data.dto';

@Component({
    selector: 'app-episode-list',
    imports: [
        DialogModule,
        DateFormattingPipe,
        ButtonModule,
        TooltipModule,
        DecimalPipe,
        DatetimeWithUnitFormattingPipe,
        NgOptimizedImage,
        Image,
        ProgressSpinnerModule,
    ],
    providers: [UC_ShortenString],
    templateUrl: './episode-list.component.html',
    styleUrl: './episode-list.component.css',
})
export class EpisodeListComponent {
    // input variables
    public episodeList: InputSignal<MediaSeasonEpisodeDetailResponseDto[]> =
        input.required<MediaSeasonEpisodeDetailResponseDto[]>();

    public sortedEpisodeList = computed(() => {
        return [...this.episodeList()].sort((a, b) => a.episodeNumber - b.episodeNumber);
    });

    public inpSelectedTracklist: InputSignal<TracklistResponseDto | null> =
        input.required<TracklistResponseDto | null>();
    public tracklistSelectionForm: InputSignal<FormGroup | null> =
        input.required<FormGroup | null>();
    public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
        input.required<TVSeasonWithTracklist | null>();
    public tracklistsOfSeason: InputSignal<TracklistResponseDto[]> =
        input.required<TracklistResponseDto[]>();
    public inpIsWithTracklist: InputSignal<boolean> = input.required<boolean>();

    public posterPath: string = TMDB_POSTER_PATH;
    public originalPosterPath: string = TMDB_ORIGINAL_IMAGE_PATH;

    public currentEpisodeForDialog: MediaSeasonEpisodeDetailResponseDto | null = null;
    public isEpisodeDialogVisible: boolean = false;
    // output variables
    @Output() setEpisode: EventEmitter<MediaSeasonEpisodeDetailResponseDto> =
        new EventEmitter<MediaSeasonEpisodeDetailResponseDto>();
    @Output() setEpisodeForEditing: EventEmitter<MediaSeasonEpisodeDetailResponseDto> =
        new EventEmitter<MediaSeasonEpisodeDetailResponseDto>();

    public isThumbnailLoading = true;
    public imageError = false;

    constructor(
        public shortenStringUseCase: UC_ShortenString
    ) {}

    public openDialog = (currenEpisode: MediaSeasonEpisodeDetailResponseDto) => {
        this.isThumbnailLoading = true;
        this.imageError = false;
        this.currentEpisodeForDialog = currenEpisode;

        setTimeout(() => {
            this.isEpisodeDialogVisible = true;
        }, 0);
    };

    public checkEpisodeInCurrentTracklist = (episodeID: number): boolean => {
        const selectedTracklist = this.inpSelectedTracklist();

        if (!selectedTracklist || !selectedTracklist.tracklistSeason) {
            return false;
        }

        const episodesOfTracklist: number[] =
            selectedTracklist.tracklistSeason.tracklistEpisodes.map(
                (epis: TracklistEpisodeDetailDataDto) => {
                    return epis.episode.id;
                },
            );

        return episodesOfTracklist.includes(episodeID);
    };

    public selectEpisode = (
        episode: MediaSeasonEpisodeDetailResponseDto,
        isEpisodeEditing: boolean,
    ) => {
        if (!isEpisodeEditing) {
            this.setEpisode.emit(episode);
            return;
        }

        this.setEpisodeForEditing.emit(episode);
    };

    public handleImageError() {
        this.isThumbnailLoading = false;
        this.imageError = true;
    }

    public getTracklistEpisodeId = (episodeID: number): number | null => {
        // Sicherstellen, dass wir im Tracklist-Modus sind und eine Tracklist geladen ist
        if (!this.inpIsWithTracklist() || !this.inpSelectedTracklist()) {
            return null;
        }

        const currentSeason = this.inpSelectedTracklist()?.tracklistSeason;

        if (!currentSeason) {
            return null;
        }

        const foundEntry = currentSeason.tracklistEpisodes.find(
            (te: TracklistEpisodeDetailDataDto) => te.episode.id === episodeID,
        );

        return foundEntry ? foundEntry.id : null;
    };

    public getEpisodeDisplayTitle = (episode: MediaSeasonEpisodeDetailResponseDto, index: number): string => {
        const relativeNumber = index + 1;
        const originalNumber = episode.episodeNumber;

        // Hilfsfunktion für die Null davor (z.B. 1 wird zu 01, 12 bleibt 12)
        const pad = (num: number) => num.toString().padStart(2, '0');

        if (relativeNumber !== originalNumber) {
            // Filter ist aktiv: Relative Nummer (Index) + Originale Nummer (TMDB)
            return `E${pad(relativeNumber)} (E${pad(originalNumber)}): ${episode.name}`;
        }

        // Kein Filter aktiv (oder Liste beginnt ohnehin bei 1): Nur Original anzeigen
        return `E${pad(originalNumber)}: ${episode.name}`;
    };
}
