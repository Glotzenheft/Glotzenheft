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
    Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { SeasonEpisode } from '../../../../app/shared/interfaces/media-interfaces';
import {
    SeasonTracklist,
    TracklistEpisode,
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
    public episodeList: InputSignal<SeasonEpisode[]> =
        input.required<SeasonEpisode[]>();
    public inpSelectedTracklist: InputSignal<SeasonTracklist | null> =
        input.required<SeasonTracklist | null>();
    public tracklistSelectionForm: InputSignal<FormGroup | null> =
        input.required<FormGroup | null>();
    public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
        input.required<TVSeasonWithTracklist | null>();
    public tracklistsOfSeason: InputSignal<SeasonTracklist[]> =
        input.required<SeasonTracklist[]>();
    public inpIsWithTracklist: InputSignal<boolean> = input.required<boolean>();

    public posterPath: string = TMDB_POSTER_PATH;
    public originalPosterPath: string = TMDB_ORIGINAL_IMAGE_PATH;

    public currentEpisodeForDialog: SeasonEpisode | null = null;
    public isEpisodeDialogVisible: boolean = false;
    // output variables
    @Output() setEpisode: EventEmitter<SeasonEpisode> =
        new EventEmitter<SeasonEpisode>();
    @Output() setEpisodeForEditing: EventEmitter<SeasonEpisode> =
        new EventEmitter<SeasonEpisode>();

    public isThumbnailLoading = true;
    public imageError = false;

    constructor(
        public shortenStringUseCase: UC_ShortenString
    ) {}

    public openDialog = (currenEpisode: SeasonEpisode) => {
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
                (epis: TracklistEpisode) => {
                    return epis.episode.id;
                },
            );

        return episodesOfTracklist.includes(episodeID);
    };

    public selectEpisode = (
        episode: SeasonEpisode,
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
            (te: TracklistEpisode) => te.episode.id === episodeID,
        );

        return foundEntry ? foundEntry.id : null;
    };
}
