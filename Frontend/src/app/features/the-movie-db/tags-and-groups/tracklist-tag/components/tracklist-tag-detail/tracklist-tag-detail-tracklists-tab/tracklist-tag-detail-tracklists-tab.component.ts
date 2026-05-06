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
