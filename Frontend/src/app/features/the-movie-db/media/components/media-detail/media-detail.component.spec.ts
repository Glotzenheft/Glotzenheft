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

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { MediaResponse } from '../../models/response/media-response.dto';
import { MediaDetailStateService } from '../../services/media-detail-state.service';
import { MediaDetailService } from '../../services/media-detail.service';
import { createMediaDetailResponse } from '../../testing/media-detail.fixtures';
import { MediaDetailComponent } from './media-detail.component';

describe('MediaDetailComponent loading', () => {
    let api: jasmine.SpyObj<MediaDetailService>;
    let state: MediaDetailStateService;
    let component: MediaDetailComponent;

    beforeEach(() => {
        api = jasmine.createSpyObj<MediaDetailService>('MediaDetailService', ['getMedia']);
        TestBed.configureTestingModule({
            providers: [
                MediaDetailStateService,
                { provide: MediaDetailService, useValue: api },
                { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
                { provide: ActivatedRoute, useValue: {} },
            ],
        });
        state = TestBed.inject(MediaDetailStateService);
        component = TestBed.runInInjectionContext(() => new MediaDetailComponent());
        component.mediaId = '10';
        component.mediaTypeUrlParam = 'movie';
    });

    it('loads the medium using the bound route inputs', () => {
        // Arrange
        const data = createMediaDetailResponse();
        api.getMedia.and.returnValue(of(data));

        // Act
        component.ngOnChanges();

        // Assert
        expect(api.getMedia).toHaveBeenCalledOnceWith('movie', 10);
        expect(state.mediaData()).toBe(data);
        expect(state.isLoading()).toBeFalse();
    });

    it('cancels the previous request and ignores its late answer when switching media', () => {
        // Arrange
        const previous = new Subject<MediaResponse>();
        const current = new Subject<MediaResponse>();
        api.getMedia.and.returnValues(previous, current);
        const next = createMediaDetailResponse([], { id: 20 });

        // Act
        component.ngOnChanges();
        component.mediaId = '20';
        component.ngOnChanges();
        const oldRequestHasObservers = previous.observed;
        current.next(next);
        previous.next(createMediaDetailResponse());

        // Assert
        expect(oldRequestHasObservers).toBeFalse();
        expect(state.mediaData()).toBe(next);
        expect(api.getMedia.calls.allArgs()).toEqual([
            ['movie', 10],
            ['movie', 20],
        ]);
    });

    it('shows a load error and lets the user retry', () => {
        // Arrange
        const data = createMediaDetailResponse();
        api.getMedia.and.returnValues(
            throwError(() => new HttpErrorResponse({ status: 500 })),
            of(data),
        );

        // Act
        component.ngOnChanges();
        const failure = state.viewState();
        component.loadMedia();

        // Assert
        expect(failure.loading).toBeFalse();
        expect(failure.error).toBeTruthy();
        expect(state.mediaData()).toBe(data);
        expect(state.viewState().error).toBeNull();
    });

    for (const id of ['0', '-1', 'abc', '1.5']) {
        it(`rejects invalid route ID ${id} without requesting media`, () => {
            // Arrange
            component.mediaId = id;

            // Act
            component.ngOnChanges();

            // Assert
            expect(api.getMedia).not.toHaveBeenCalled();
            expect(state.viewState().error).toContain('ungültig');
            expect(state.isLoading()).toBeFalse();
        });
    }
});
