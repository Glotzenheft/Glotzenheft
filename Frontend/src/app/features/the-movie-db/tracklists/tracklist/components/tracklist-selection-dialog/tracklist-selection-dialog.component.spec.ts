import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TracklistSelectionDialogComponent} from './tracklist-selection-dialog.component';

describe('TracklistSelectionDialogComponent', () => {
    let component: TracklistSelectionDialogComponent;
    let fixture: ComponentFixture<TracklistSelectionDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TracklistSelectionDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TracklistSelectionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
