import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeListWithoutTracklistComponent } from './episode-list-without-tracklist.component';

describe('EpisodeListWithoutTracklistComponent', () => {
  let component: EpisodeListWithoutTracklistComponent;
  let fixture: ComponentFixture<EpisodeListWithoutTracklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeListWithoutTracklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeListWithoutTracklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
