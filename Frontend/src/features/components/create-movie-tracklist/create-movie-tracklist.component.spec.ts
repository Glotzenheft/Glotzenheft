import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMovieTracklistComponent } from './create-movie-tracklist.component';

describe('CreateMovieTracklistComponent', () => {
  let component: CreateMovieTracklistComponent;
  let fixture: ComponentFixture<CreateMovieTracklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMovieTracklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMovieTracklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
