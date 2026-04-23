import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagOverviewComponent } from './tracklist-tag-overview.component';

describe('TracklistTagOverviewComponent', () => {
  let component: TracklistTagOverviewComponent;
  let fixture: ComponentFixture<TracklistTagOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
