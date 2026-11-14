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

import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TracklistSelectionService } from './tracklist-selection.service';

describe('TracklistSelectionService', () => {
    const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
    let values: Map<string, string>;
    let storage: jasmine.SpyObj<Storage>;

    beforeEach(() => {
        values = new Map();
        storage = jasmine.createSpyObj<Storage>('Storage', ['getItem', 'setItem', 'removeItem']);
        storage.getItem.and.callFake((key) => values.get(key) ?? null);
        storage.setItem.and.callFake((key, value) => {
            values.set(key, value);
        });
        storage.removeItem.and.callFake((key) => {
            values.delete(key);
        });
        Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
    });
    afterEach(() => {
        if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
        else Reflect.deleteProperty(globalThis, 'localStorage');
    });
    function create(platform = 'browser'): TracklistSelectionService {
        TestBed.configureTestingModule({
            providers: [TracklistSelectionService, { provide: PLATFORM_ID, useValue: platform }],
        });
        return TestBed.inject(TracklistSelectionService);
    }

    it('stores an independent selection for each media and season', () => {
        // Arrange
        const service = create();

        // Act
        service.set(11, 20, 42);
        service.set(11, 21, 43);
        service.set(12, 20, 44);

        // Assert
        expect(service.get(11, 20)).toBe(42);
        expect(service.get(11, 21)).toBe(43);
        expect(service.get(12, 20)).toBe(44);
    });

    it('supports the old selected ID as a validated-by-caller fallback', () => {
        // Arrange
        const service = create();
        values.set('currentTracklist', '42');

        // Act
        const selected = service.get(11, 20);

        // Assert
        expect(selected).toBe(42);
        expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('ignores browser storage when running on the server', () => {
        // Arrange
        const service = create('server');

        // Act
        service.set(11, 20, 42);
        const selected = service.get(11, 20);

        // Assert
        expect(selected).toBeNull();
        expect(storage.getItem).not.toHaveBeenCalled();
        expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('remains usable when storage is unavailable or full', () => {
        // Arrange
        const service = create();
        storage.getItem.and.throwError('Blocked');
        storage.setItem.and.throwError('Quota exceeded');

        // Act
        service.set(11, 20, 42);
        const selected = service.get(11, 20);

        // Assert
        expect(selected).toBeNull();
    });

    it('removes a deleted selection', () => {
        // Arrange
        const service = create();
        service.set(11, 20, 42);

        // Act
        service.set(11, 20, null);

        // Assert
        expect(service.get(11, 20)).toBeNull();
    });
});
