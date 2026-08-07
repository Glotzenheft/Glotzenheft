import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailTracklistsTabComponent } from './media-detail-tracklists-tab.component';

describe('MediaDetailTracklistsTabComponent', () => {
  let component: MediaDetailTracklistsTabComponent;
  let fixture: ComponentFixture<MediaDetailTracklistsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailTracklistsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailTracklistsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
