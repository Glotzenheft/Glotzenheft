import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailTvSeriesTracklistsTabComponent } from './media-detail-tv-series-tracklists-tab.component';

describe('MediaDetailTvSeriesTracklistsTabComponent', () => {
  let component: MediaDetailTvSeriesTracklistsTabComponent;
  let fixture: ComponentFixture<MediaDetailTvSeriesTracklistsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailTvSeriesTracklistsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailTvSeriesTracklistsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
