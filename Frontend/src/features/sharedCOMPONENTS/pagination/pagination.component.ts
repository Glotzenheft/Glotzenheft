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

import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { SelectOption } from '../../../shared/interfaces/select-option.interface';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { StringFormattingPipe } from "../../../pipes/string-formatting/string-formatting.pipe";

@Component({
    selector: 'app-pagination',
    imports: [SelectModule, FormsModule, ButtonModule, Tooltip, StringFormattingPipe],
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.css'
})
export class PaginationComponent {
    // input variables
    public inpIsLeftButtonDisabled: InputSignal<boolean> = input.required<boolean>();
    public inpIsRightButtonDisabled: InputSignal<boolean> = input.required<boolean>();
    public inpSelectOptions: InputSignal<SelectOption[]> = input.required<SelectOption[]>();
    public inpTotalPages: InputSignal<number> = input.required<number>();
    public inpTotalResults: InputSignal<number> = input.required<number>();
    public inpCurrentPage: InputSignal<number> = input.required<number>();
    public inpTotalPagesText: InputSignal<string> = input.required<string>();

    // output variables
    public outOnClickLeftButton: OutputEmitterRef<boolean> = output<boolean>();
    public outOnClickRightButton: OutputEmitterRef<boolean> = output<boolean>();
    public outOnChangeSelection: OutputEmitterRef<number> = output<number>();

    public changeToPrevPage = () => { this.outOnClickLeftButton.emit(true); }

    public changeToNextPage = () => { this.outOnClickRightButton.emit(true); }

    public changeSelection = (page: number) => { this.outOnChangeSelection.emit(page); }


}
