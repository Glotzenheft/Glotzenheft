import {Pipe, PipeTransform} from '@angular/core';
import {
    TracklistStatusEnum
} from '../../../features/the-movie-db/tracklists/tracklist/models/enums/tracklist-status.enum';
import {
    TRACKLIST_STATUS_LABELS_DE
} from '../../../features/the-movie-db/tracklists/tracklist/models/constants/tracklist-status.constants';

@Pipe({
    name: 'tracklistStatus',
    standalone: true
})
export class TracklistStatusPipe implements PipeTransform {
    transform(value: TracklistStatusEnum | string | null | undefined): string {
        if (!value) {
            return '';
        }

        const label = TRACKLIST_STATUS_LABELS_DE[value as TracklistStatusEnum];
        return label ?? String(value);
    }
}
