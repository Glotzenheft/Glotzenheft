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

import { Component, inject } from '@angular/core';
import { ActivityTableComponent } from '../../../../../activities/components/activity-table/activity-table.component';
import { TracklistTagDetailStateService } from '../../../services/tracklist-tag-detail-state.service';

@Component({
    selector: 'app-tracklist-tag-detail-activities-tab',
    imports: [ActivityTableComponent],
    template: `
        @if (state.tagData(); as tag) {
            <app-activity-table [tagId]="tag.id" />
        }
    `,
})
export class TracklistTagDetailActivitiesTabComponent {
    protected readonly state = inject(TracklistTagDetailStateService);
}
