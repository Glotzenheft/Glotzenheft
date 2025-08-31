import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistFormularComponent } from './tracklist-formular.component';

describe('TracklistFormularComponent', () => {
  let component: TracklistFormularComponent;
  let fixture: ComponentFixture<TracklistFormularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistFormularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
