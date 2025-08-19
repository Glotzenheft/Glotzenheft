import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { SelectOption } from '../../../shared/interfaces/select-option.interface';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";

@Component({
    selector: 'app-pagination',
    imports: [SelectModule, FormsModule, ButtonModule, Tooltip],
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

    // output variables
    public outOnClickLeftButton: OutputEmitterRef<boolean> = output<boolean>();
    public outOnClickRightButton: OutputEmitterRef<boolean> = output<boolean>();
    public outOnChangeSelection: OutputEmitterRef<number> = output<number>();

    public changeToPrevPage = () => { this.outOnClickLeftButton.emit(true); }

    public changeToNextPage = () => { this.outOnClickRightButton.emit(true); }

    public changeSelection = (page: number) => { this.outOnChangeSelection.emit(page); }


}
