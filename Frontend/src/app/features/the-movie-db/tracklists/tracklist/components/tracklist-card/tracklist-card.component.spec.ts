import { TestBed } from '@angular/core/testing';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { of, Subject, throwError } from 'rxjs';
import {
    createMediaDetailResponse,
    createTracklistResponse,
} from '../../../../media/testing/media-detail.fixtures';
import { TracklistTagAssociationService } from '../../../../tags-and-groups/tracklist-tag/services/tracklist-tag-association.service';
import { TracklistTagLightResponseDto } from '../../../../tags-and-groups/tracklist-tag/models/response/tracklist-tag-light-response.dto';
import { TracklistService } from '../../services/tracklist.service';
import { TracklistTagFormDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-form-dialog/tracklist-tag-form-dialog.component';
import { TracklistTagUnlinkDialogComponent } from '../../../../tags-and-groups/tracklist-tag/components/tracklist-tag-unlink-dialog/tracklist-tag-unlink-dialog.component';
import { TracklistCardComponent } from './tracklist-card.component';

describe('TracklistCardComponent', () => {
    let component: TracklistCardComponent;
    let dialogs: jasmine.SpyObj<DialogService>;
    let api: jasmine.SpyObj<TracklistService>;
    let associations: jasmine.SpyObj<TracklistTagAssociationService>;
    let closed: Subject<TracklistTagLightResponseDto[]>;
    let ref: jasmine.SpyObj<DynamicDialogRef>;

    beforeEach(() => {
        dialogs = jasmine.createSpyObj('DialogService', ['open']);
        api = jasmine.createSpyObj('TracklistService', ['getTracklist']);
        associations = jasmine.createSpyObj('TracklistTagAssociationService', [
            'addTagsToTracklist',
            'removeTagsFromTracklist',
        ]);
        closed = new Subject<TracklistTagLightResponseDto[]>();
        ref = jasmine.createSpyObj('DynamicDialogRef', ['destroy'], {
            onClose: closed,
        });
        dialogs.open.and.returnValue(ref);
        TestBed.configureTestingModule({
            providers: [
                { provide: DialogService, useValue: dialogs },
                { provide: TracklistService, useValue: api },
                {
                    provide: TracklistTagAssociationService,
                    useValue: associations,
                },
            ],
        });
        component = TestBed.runInInjectionContext(
            () => new TracklistCardComponent(),
        );
        component.tracklist = createTracklistResponse();
        component.media = createMediaDetailResponse([], {
            posterPath: '/media.jpg',
        }).media;
    });

    it('keeps the menu model stable between change detection passes', () => {
        component.ngOnChanges();
        expect(component.tagActions).toBe(component.tagActions);
    });

    it('opens the creation dialog from the split button menu', () => {
        component.ngOnChanges();
        component.tagActions[0].command?.({});
        expect(dialogs.open).toHaveBeenCalledWith(
            TracklistTagFormDialogComponent,
            jasmine.objectContaining({
                data: { prefill: { tracklistId: 42 } },
            }),
        );
    });

    it('opens the unlink dialog and updates its disabled state', () => {
        component.ngOnChanges();
        expect(component.tagActions[1].disabled).toBeTrue();
        component.tracklist = createTracklistResponse({
            tags: [{ id: 8 } as TracklistTagLightResponseDto],
        });
        component.ngOnChanges();
        expect(component.tagActions[1].disabled).toBeFalse();
        component.tagActions[1].command?.({});
        expect(dialogs.open).toHaveBeenCalledWith(
            TracklistTagUnlinkDialogComponent,
            jasmine.objectContaining({
                data: { tags: component.tracklist.tags },
            }),
        );
    });

    it('prefers the custom poster and falls back to the media poster', () => {
        component.tracklist.customPosterPath = '/custom.jpg';
        expect(component.posterPath).toBe('/custom.jpg');
        component.tracklist.customPosterPath = null;
        expect(component.posterPath).toBe('/media.jpg');
        expect(component.imageUrl()).not.toContain('//media.jpg');
    });

    it('adds selected tags and emits the refreshed tracklist', () => {
        const updated = createTracklistResponse();
        const emitted = spyOn(component.updated, 'emit');
        associations.addTagsToTracklist.and.returnValue(of(undefined));
        api.getTracklist.and.returnValue(of(updated));
        component.linkTags();
        closed.next([{ id: 8 } as TracklistTagLightResponseDto]);
        expect(associations.addTagsToTracklist).toHaveBeenCalledOnceWith(42, [
            8,
        ]);
        expect(api.getTracklist).toHaveBeenCalledOnceWith(42);
        expect(emitted).toHaveBeenCalledOnceWith(updated);
        expect(component.busy()).toBeFalse();
    });

    it('does not mutate tags after cancellation', () => {
        component.linkTags();
        closed.next([]);
        expect(associations.addTagsToTracklist).not.toHaveBeenCalled();
        expect(api.getTracklist).not.toHaveBeenCalled();
    });

    it('only removes the selected associations', () => {
        component.tracklist.tags = [
            { id: 8 },
            { id: 9 },
        ] as TracklistTagLightResponseDto[];
        associations.removeTagsFromTracklist.and.returnValue(of(undefined));
        api.getTracklist.and.returnValue(of(createTracklistResponse()));
        component.unlinkTags();
        closed.next([{ id: 8 } as TracklistTagLightResponseDto]);
        expect(associations.removeTagsFromTracklist).toHaveBeenCalledOnceWith(
            42,
            [8],
        );
    });

    it('allows reloading after a tag request fails', () => {
        associations.addTagsToTracklist.and.returnValue(
            throwError(() => new Error('Failed')),
        );
        component.linkTags();
        closed.next([{ id: 8 } as TracklistTagLightResponseDto]);
        expect(component.error()).toBeTruthy();
        expect(component.busy()).toBeFalse();
        api.getTracklist.and.returnValue(of(createTracklistResponse()));
        component.refresh();
        expect(component.error()).toBeNull();
        expect(api.getTracklist).toHaveBeenCalledOnceWith(42);
    });

    it('destroys open dialogs and stops observing when the card is destroyed', () => {
        component.linkTags();
        TestBed.resetTestingModule();
        expect(ref.destroy).toHaveBeenCalled();
        expect(closed.observed).toBeFalse();
    });
});
