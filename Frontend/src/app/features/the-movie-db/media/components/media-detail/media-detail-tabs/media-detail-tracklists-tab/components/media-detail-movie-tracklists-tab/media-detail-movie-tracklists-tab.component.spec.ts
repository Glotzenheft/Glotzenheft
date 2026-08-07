import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailMovieTracklistsTabComponent } from './media-detail-movie-tracklists-tab.component';

describe('MediaDetailMovieTracklistsTabComponent', () => {
  let component: MediaDetailMovieTracklistsTabComponent;
  let fixture: ComponentFixture<MediaDetailMovieTracklistsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailMovieTracklistsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailMovieTracklistsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
