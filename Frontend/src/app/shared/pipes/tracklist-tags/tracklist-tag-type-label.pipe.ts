import {Pipe, PipeTransform} from '@angular/core';
import {TracklistTagType} from '../../../features/tracklist-tag/models/tracklist-tag-type.enum';
import {TRACKLIST_TAG_TYPE_LABELS} from '../../../features/tracklist-tag/models/constants/tracklist-tag-type.constants';

@Pipe({
    name: 'tracklistTagTypeLabel',
    standalone: true
})
export class TracklistTagTypeLabelPipe implements PipeTransform {
    transform(value: TracklistTagType | string | null | undefined): string {
        if (!value) return '';
        return TRACKLIST_TAG_TYPE_LABELS[value as TracklistTagType] || value;
    }
}
