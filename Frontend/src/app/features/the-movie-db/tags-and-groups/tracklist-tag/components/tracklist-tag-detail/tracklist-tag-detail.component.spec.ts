import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagDetailComponent } from './tracklist-tag-detail.component';

describe('TracklistTagDetailComponent', () => {
  let component: TracklistTagDetailComponent;
  let fixture: ComponentFixture<TracklistTagDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
