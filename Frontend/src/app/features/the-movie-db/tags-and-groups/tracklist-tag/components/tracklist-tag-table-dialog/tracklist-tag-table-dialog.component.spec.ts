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

import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TracklistTagLightResponseDto } from '../../models/response/tracklist-tag-light-response.dto';
import { TracklistTagType } from '../../models/tracklist-tag-type.enum';
import { TracklistTagTableDialogComponent } from './tracklist-tag-table-dialog.component';

describe('TracklistTagTableDialogComponent', () => {
    let component: TracklistTagTableDialogComponent;
    let messageService: jasmine.SpyObj<MessageService>;
    let dialogRef: jasmine.SpyObj<DynamicDialogRef>;

    const tags: TracklistTagLightResponseDto[] = [
        {
            id: 1,
            tagName: 'Drama',
            slug: 'drama',
            tracklistTagType: TracklistTagType.GENRE,
            color: '#ffffff',
            description: null,
            icon: null,
            isSpoiler: false,
            isAdult: false,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
        {
            id: 2,
            tagName: 'Mystery',
            slug: 'mystery',
            tracklistTagType: TracklistTagType.GENRE,
            color: '#000000',
            description: null,
            icon: null,
            isSpoiler: false,
            isAdult: false,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
        {
            id: 3,
            tagName: 'Mind-Bending',
            slug: 'mind-bending',
            tracklistTagType: TracklistTagType.THEME,
            color: null,
            description: null,
            icon: null,
            isSpoiler: false,
            isAdult: false,
            createdAt: '2026-10-01 19:00:00',
            updatedAt: null,
        },
    ];

    beforeEach(() => {
        messageService = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
        dialogRef = jasmine.createSpyObj<DynamicDialogRef>('DynamicDialogRef', ['close']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DynamicDialogConfig, useValue: { data: { tags } } },
                { provide: DynamicDialogRef, useValue: dialogRef },
                { provide: MessageService, useValue: messageService },
            ],
        });
        component = TestBed.runInInjectionContext(() => new TracklistTagTableDialogComponent());
    });

    it('groups the provided tags by category', () => {
        const genre = component.categories().find((category) => category.value === TracklistTagType.GENRE);
        const theme = component.categories().find((category) => category.value === TracklistTagType.THEME);

        expect(genre?.tags).toEqual(tags.slice(0, 2));
        expect(theme?.tags).toEqual([tags[2]]);
    });

    it('copies all IDs from the requested category', async () => {
        const writeText = jasmine.createSpy('writeText').and.resolveTo();
        spyOnProperty(navigator, 'clipboard', 'get').and.returnValue({ writeText } as unknown as Clipboard);

        await component.copyTagIds(tags);

        expect(writeText).toHaveBeenCalledOnceWith('1,2,3');
        expect(messageService.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    });

    it('closes when a tag is selected', () => {
        component.close();

        expect(dialogRef.close).toHaveBeenCalledOnceWith();
    });
});