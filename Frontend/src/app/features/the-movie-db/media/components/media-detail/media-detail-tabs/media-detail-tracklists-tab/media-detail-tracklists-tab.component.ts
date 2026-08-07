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

import {Component, inject} from '@angular/core';
import {MediaDetailStateService} from '../../../../services/media-detail-state.service';
import {MediaType} from '../../../../models/enums/media-type.enum';
import {
    MediaDetailMovieTracklistsTabComponent
} from './components/media-detail-movie-tracklists-tab/media-detail-movie-tracklists-tab.component';
import {
    MediaDetailTvSeriesTracklistsTabComponent
} from './components/media-detail-tv-series-tracklists-tab/media-detail-tv-series-tracklists-tab.component';

@Component({
    selector: 'app-media-detail-tracklists-tab',
    standalone: true,
    imports: [
        MediaDetailMovieTracklistsTabComponent,
        MediaDetailTvSeriesTracklistsTabComponent,
    ],
    templateUrl: './media-detail-tracklists-tab.component.html',
    styleUrl: './media-detail-tracklists-tab.component.css'
})
export class MediaDetailTracklistsTabComponent {
    public state: MediaDetailStateService = inject(MediaDetailStateService)
    public MediaType: typeof MediaType = MediaType;
}
