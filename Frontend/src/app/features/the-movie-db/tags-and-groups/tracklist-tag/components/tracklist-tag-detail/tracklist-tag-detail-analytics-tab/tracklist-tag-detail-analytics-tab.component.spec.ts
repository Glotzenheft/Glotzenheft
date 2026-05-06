import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagDetailAnalyticsTabComponent } from './tracklist-tag-detail-analytics-tab.component';

describe('TracklistTagDetailAnalyticsTabComponent', () => {
  let component: TracklistTagDetailAnalyticsTabComponent;
  let fixture: ComponentFixture<TracklistTagDetailAnalyticsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagDetailAnalyticsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagDetailAnalyticsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
