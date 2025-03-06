import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistFormComponent } from './tracklist-form.component';

describe('TracklistFormComponent', () => {
  let component: TracklistFormComponent;
  let fixture: ComponentFixture<TracklistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
