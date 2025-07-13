/*
All files are part of Glotzenheft.

Glotzenheft is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Glotzenheft is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. w

Alle Dateien sind Teil vom Glotzenheft.

Glotzenheft ist Freie Software: Sie können es unter den Bedingungen
der GNU General Public License, wie von der Free Software Foundation,
Version 3 der Lizenz oder (nach Ihrer Wahl) jeder neueren
veröffentlichten Version, weiter verteilen und/oder modifizieren.

Glotzenheft wird in der Hoffnung, dass es nützlich sein wird, aber
OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
Siehe die GNU General Public License für weitere Details.

Sie sollten eine Kopie der GNU General Public License zusammen mit diesem
Programm erhalten haben. Wenn nicht, siehe <https://www.gnu.org/licenses/>.
*/

import {
    Component,
    EventEmitter,
    input,
    InputSignal,
    OnInit,
    Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-delete-dialog',
    imports: [ButtonModule, DialogModule],
    templateUrl: './delete-dialog.component.html',
    styleUrl: './delete-dialog.component.css',
})
export class DeleteDialogComponent implements OnInit {
    // input variables
    public inpHeading: InputSignal<string> = input.required<string>();
    public inpText: InputSignal<string> = input.required<string>();
    public inpIsButtonEnabled: InputSignal<boolean> = input.required<boolean>()

    // output variables
    @Output() outDeleteMedia: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() outCancelDeletion: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    // other variables
    public isDialogVisible: boolean = false;

    ngOnInit(): void {
        this.isDialogVisible = true;
    }

    // functions ---------------------------------
    public deleteMedia = () => {
        this.outDeleteMedia.emit(true);
    };

    public cancelDeletion = () => {
        this.outCancelDeletion.emit(true);
    };
}
