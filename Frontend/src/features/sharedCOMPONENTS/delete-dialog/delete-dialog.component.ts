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
