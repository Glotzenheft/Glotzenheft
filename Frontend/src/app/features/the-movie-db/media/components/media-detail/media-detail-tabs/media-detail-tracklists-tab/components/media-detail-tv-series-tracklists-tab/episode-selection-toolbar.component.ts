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
