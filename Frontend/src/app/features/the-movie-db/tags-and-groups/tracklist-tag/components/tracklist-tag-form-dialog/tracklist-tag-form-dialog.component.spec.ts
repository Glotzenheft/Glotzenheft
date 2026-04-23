import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagFormDialogComponent } from './tracklist-tag-form-dialog.component';

describe('TracklistTagFormDialogComponent', () => {
  let component: TracklistTagFormDialogComponent;
  let fixture: ComponentFixture<TracklistTagFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
