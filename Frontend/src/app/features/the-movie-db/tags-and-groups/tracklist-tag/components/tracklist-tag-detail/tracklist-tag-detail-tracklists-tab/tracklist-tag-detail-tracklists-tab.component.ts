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
import {CommonModule} from '@angular/common';
import {TracklistTagDetailStateService} from '../../../services/tracklist-tag-detail-state.service';

@Component({
    selector: 'app-tracklist-tag-detail-tracklists-tab',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tracklist-tag-detail-tracklists-tab.component.html',
    styleUrl: './tracklist-tag-detail-tracklists-tab.component.css'
})
export class TracklistTagDetailTracklistsTabComponent {
    public state = inject(TracklistTagDetailStateService);
}
