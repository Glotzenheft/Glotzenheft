import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';

export type EpisodeSelectionMode = 'edit' | 'add' | 'remove';
export const selectionActions = {
    edit: 'bearbeiten',
    add: 'hinzufügen',
    remove: 'entfernen',
};

@Component({
    selector: 'app-episode-selection-toolbar',
    imports: [Button, Toolbar],
    templateUrl: './episode-selection-toolbar.component.html',
    styleUrl: './episode-selection-toolbar.component.css',
})
export class EpisodeSelectionToolbarComponent {
    readonly mode = input.required<EpisodeSelectionMode>();
    readonly count = input.required<number>();
    readonly total = input.required<number>();
    readonly pending = input.required<boolean>();
    readonly error = input.required<string>();
    readonly reloadStatus = input.required<'available' | 'required' | null>();
    readonly toggleAll = output<void>();
    readonly cancel = output<void>();
    readonly proceed = output<void>();
    readonly reload = output<void>();
    readonly actions = selectionActions;
}
