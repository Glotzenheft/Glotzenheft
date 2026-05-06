import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagDetailTracklistsTabComponent } from './tracklist-tag-detail-tracklists-tab.component';

describe('TracklistTagDetailTracklistsTabComponent', () => {
  let component: TracklistTagDetailTracklistsTabComponent;
  let fixture: ComponentFixture<TracklistTagDetailTracklistsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagDetailTracklistsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagDetailTracklistsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
