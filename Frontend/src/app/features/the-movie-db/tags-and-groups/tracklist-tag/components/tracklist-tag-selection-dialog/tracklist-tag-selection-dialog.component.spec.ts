import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TracklistTagSelectionDialogComponent} from './tracklist-tag-selection-dialog.component';

describe('TracklistTagSelectionDialogComponent', () => {
    let component: TracklistTagSelectionDialogComponent;
    let fixture: ComponentFixture<TracklistTagSelectionDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TracklistTagSelectionDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TracklistTagSelectionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
