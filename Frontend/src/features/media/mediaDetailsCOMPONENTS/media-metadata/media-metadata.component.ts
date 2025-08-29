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

import { Component, input, InputSignal, OnInit } from '@angular/core';
import { Film, Season, SeasonWithEpisodes } from '../../../../app/shared/interfaces/media-interfaces';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-media-metadata',
    imports: [CommonModule],
    template: `
    <ul>
        @if (!inpIsMovie() && inpSeasonData() !== null) {
            @if (inpSeasonData()?.tracklists && inpSeasonData()?.tracklists!.length > 0) {
                <li>{{inpSeasonData()?.tracklists!.length}} Tracklisten insgesamt</li>
            } @else {
                <li><i>keine Tracklisten vorhanden</i></li>
            }
            <li>{{inpSeasonData()?.media?.seasons?.length}} Staffeln insgesamt</li>
            <li *ngIf="episodeNumber">{{episodeNumber}} Episoden insgesamt</li>
        } 
        @if (inpIsMovie() && inpFilmData()) {
            @if (inpFilmData()?.tracklists && inpFilmData()?.tracklists!.length) {
                <li>{{inpFilmData()?.tracklists!.length}} Tracklisten insgesamt</li>
            } @else {
                <li><i>keine Tracklisten vorhanden</i></li>
            }
            
        }
    </ul>
  `,
    styles: [
        `li {margin-top: 1rem}
        `
    ]
})
export class MediaMetadataComponent implements OnInit {
    public inpIsMovie: InputSignal<boolean> = input.required<boolean>();
    public inpFilmData: InputSignal<Film | null> = input.required<Film | null>();
    public inpSeasonData: InputSignal<Season | null> = input.required<Season | null>();

    public episodeNumber: number | null = null;


    ngOnInit(): void {
        this.episodeNumber = this.inpSeasonData()
            ?.media.seasons.map((season: SeasonWithEpisodes) => season.episodeCount)
            .reduce((prevValue: number, currentValue: number) => prevValue + currentValue, 0) ?? null;
    }


}