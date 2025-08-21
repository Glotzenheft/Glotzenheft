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
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DateFormattingPipe } from '../../../../pipes/date-formatting/date-formatting.pipe';
import { SeasonEpisode } from '../../../../app/shared/interfaces/media-interfaces';
import { SeasonTracklist, TracklistEpisode, TVSeasonWithTracklist } from '../../../../app/shared/interfaces/tracklist-interfaces';
import { TMDB_POSTER_PATH } from '../../../../app/shared/variables/tmdb-vars';
import { UC_ShortenString } from '../../../../app/core/use-cases/string/shorten-string.use-case';

@Component({
    selector: 'app-episode-list',
    imports: [
        DialogModule,
        DateFormattingPipe,
        ButtonModule,
        TooltipModule,
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
    public tracklistSelectionForm: InputSignal<FormGroup<any> | null> =
        input.required<FormGroup<any> | null>();
    public selectedSeason: InputSignal<TVSeasonWithTracklist | null> =
        input.required<TVSeasonWithTracklist | null>();
    public tracklistsOfSeason: InputSignal<SeasonTracklist[]> =
        input.required<SeasonTracklist[]>();
    public inpIsWithTracklist: InputSignal<boolean> = input.required<boolean>();

    public posterPath: string = TMDB_POSTER_PATH;

    public currentEpisodeForDialog: SeasonEpisode | null = null;
    public isEpisodeDialogVisible: boolean = false;
    // output variables
    @Output() setEpisode: EventEmitter<SeasonEpisode> =
        new EventEmitter<SeasonEpisode>();
    @Output() setEpisodeForEditing: EventEmitter<SeasonEpisode> =
        new EventEmitter<SeasonEpisode>();

    constructor(public shortenStringUseCase: UC_ShortenString) { }

    public openDialog = (currenEpisode: SeasonEpisode) => {
        this.currentEpisodeForDialog = currenEpisode;
        this.isEpisodeDialogVisible = true;
    };

    public checkEpisodeInCurrentTracklist = (episodeID: number): boolean => {
        const episodesOfTracklist: number[] =
            this.inpSelectedTracklist()!.tracklistSeasons[0].tracklistEpisodes.map(
                (epis: TracklistEpisode) => {
                    return epis.episode.id;
                }
            );

        if (episodesOfTracklist.includes(episodeID)) {
            return true;
        }
        return false;
    };

    public selectEpisode = (
        episode: SeasonEpisode,
        isEpisodeEditing: boolean
    ) => {
        if (!isEpisodeEditing) {
            this.setEpisode.emit(episode);
            return;
        }

        this.setEpisodeForEditing.emit(episode);
    };
}
