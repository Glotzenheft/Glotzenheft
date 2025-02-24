import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTracklistEpisodeFormComponent } from './create-tracklist-episode-form.component';

describe('CreateTracklistEpisodeFormComponent', () => {
  let component: CreateTracklistEpisodeFormComponent;
  let fixture: ComponentFixture<CreateTracklistEpisodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTracklistEpisodeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTracklistEpisodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
