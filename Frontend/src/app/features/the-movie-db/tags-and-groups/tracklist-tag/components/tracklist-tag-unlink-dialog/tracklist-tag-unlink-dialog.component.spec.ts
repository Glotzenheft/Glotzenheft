import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TracklistTagUnlinkDialogComponent} from './tracklist-tag-unlink-dialog.component';

describe('TracklistTagUnlinkDialogComponent', () => {
    let component: TracklistTagUnlinkDialogComponent;
    let fixture: ComponentFixture<TracklistTagUnlinkDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TracklistTagUnlinkDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TracklistTagUnlinkDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
