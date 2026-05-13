import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TracklistUnlinkDialogComponent} from './tracklist-unlink-dialog.component';

describe('TracklistUnlinkDialogComponent', () => {
    let component: TracklistUnlinkDialogComponent;
    let fixture: ComponentFixture<TracklistUnlinkDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TracklistUnlinkDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TracklistUnlinkDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
