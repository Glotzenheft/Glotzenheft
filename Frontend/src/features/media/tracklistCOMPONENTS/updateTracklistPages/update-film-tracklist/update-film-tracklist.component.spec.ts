import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFilmTracklistComponent } from './update-film-tracklist.component';

describe('UpdateFilmTracklistComponent', () => {
  let component: UpdateFilmTracklistComponent;
  let fixture: ComponentFixture<UpdateFilmTracklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFilmTracklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFilmTracklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
