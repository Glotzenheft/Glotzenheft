import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracklistTagFilterComponent } from './tracklist-tag-filter.component';

describe('TracklistTagFilterComponent', () => {
  let component: TracklistTagFilterComponent;
  let fixture: ComponentFixture<TracklistTagFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TracklistTagFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TracklistTagFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
