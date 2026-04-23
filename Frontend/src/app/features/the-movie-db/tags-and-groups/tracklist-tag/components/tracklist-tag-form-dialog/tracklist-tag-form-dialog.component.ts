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

import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import {ColorPickerModule} from 'primeng/colorpicker';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {TracklistTagService} from '../../services/tracklist-tag.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TracklistTagType} from '../../models/tracklist-tag-type.enum';
import {TracklistTagResponseDto} from '../../models/response/tracklist-tag-response.dto';
import {CreateTracklistTagRequestDto} from '../../models/request/create-tracklist-tag-request.dto';
import {UpdateTracklistTagRequestDto} from '../../models/request/update-tracklist-tag-request.dto';
import {TextareaModule} from 'primeng/textarea';
import {Tooltip} from 'primeng/tooltip';
import {TRACKLIST_TAG_TYPE_OPTIONS} from '../../models/constants/tracklist-tag-type.constants';

@Component({
    selector: 'app-tracklist-tag-form-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        ColorPickerModule,
        CheckboxModule,
        TextareaModule,
        InputNumberModule,
        ButtonModule,
        Tooltip
    ],
    templateUrl: './tracklist-tag-form-dialog.component.html',
    styleUrl: './tracklist-tag-form-dialog.component.css'
})
export class TracklistTagFormDialogComponent implements OnInit{
    private readonly fb = inject(FormBuilder);
    private readonly tracklistTagService = inject(TracklistTagService);
    private readonly dialogRef = inject(DynamicDialogRef);
    private readonly dialogConfig = inject(DynamicDialogConfig);

    isSaving = signal(false);
    isUpdateMode = signal(false);
    tagIdToUpdate = signal<number | null>(null);

    typeOptions = TRACKLIST_TAG_TYPE_OPTIONS;

    form = this.fb.group({
        tag_name: new FormControl<string>('', { validators: [Validators.required], nonNullable: true }),
        tracklist_tag_type: new FormControl<TracklistTagType>(TracklistTagType.OTHER, { validators: [Validators.required], nonNullable: true }),
        color: new FormControl<string | null>(null),
        description: new FormControl<string | null>(null),
        tracklist_id: new FormControl<number | null>(null),
        is_spoiler: new FormControl<boolean>(false, { nonNullable: true }),
        is_adult: new FormControl<boolean>(false, { nonNullable: true }),
        icon: new FormControl<string | null>(null) // Erstmal im HTML ausgeblendet
    });

    ngOnInit(): void {
        // Daten auslesen, die beim Öffnen des Dialogs übergeben wurden
        const data = this.dialogConfig.data;

        if (data) {
            // UPDATE
            if (data.tag) {
                const tag: TracklistTagResponseDto = data.tag;
                this.isUpdateMode.set(true);
                this.tagIdToUpdate.set(tag.id);

                this.form.patchValue({
                    tag_name: tag.tagName,
                    tracklist_tag_type: tag.tracklistTagType as TracklistTagType,
                    description: tag.description,
                    is_spoiler: tag.isSpoiler,
                    is_adult: tag.isAdult,
                    icon: tag.icon,
                    // PrimeNG ColorPicker braucht den Hex-Code oft OHNE '#', also entfernen wir es fürs Formular falls vorhanden
                    color: tag.color ? tag.color.replace('#', '') : null
                });
            }

            // CREATE
            if (data.prefill) {
                if (data.prefill.tracklistId) {
                    this.form.controls.tracklist_id.setValue(data.prefill.tracklistId);
                }
                if (data.prefill.type) {
                    this.form.controls.tracklist_tag_type.setValue(data.prefill.type);
                }
            }
        }
    }

    clearTracklistId(): void {
        this.form.controls.tracklist_id.setValue(null);
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSaving.set(true);

        const formValues = this.form.getRawValue();

        let formattedColor = formValues.color;
        if (formattedColor && !formattedColor.startsWith('#')) {
            formattedColor = `#${formattedColor}`;
        }

        if (this.isUpdateMode() && this.tagIdToUpdate()) {
            // UPDATE
            const { tracklist_id, ...rest } = formValues;

            const updateDto: UpdateTracklistTagRequestDto = {
                ...rest,
                color: formattedColor
            };

            this.tracklistTagService.updateTag(this.tagIdToUpdate()!, updateDto).subscribe({
                next: (updatedTag) => this.dialogRef.close(updatedTag),
                error: () => this.isSaving.set(false)
            });

        } else {
            // CREATE
            const createDto: CreateTracklistTagRequestDto = {
                ...formValues,
                color: formattedColor
            };

            this.tracklistTagService.createTag(createDto).subscribe({
                next: (newTag) => this.dialogRef.close(newTag),
                error: (err) => {
                    console.error('Fehler beim Erstellen:', err);
                    this.isSaving.set(false);
                }
            });
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }

    onColorChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.form.controls.color.setValue(input.value);
    }

    clearColor(): void {
        this.form.controls.color.setValue(null);
    }
}
