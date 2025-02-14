import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewTracklistComponent } from './create-new-tracklist.component';

describe('CreateNewTracklistComponent', () => {
  let component: CreateNewTracklistComponent;
  let fixture: ComponentFixture<CreateNewTracklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewTracklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewTracklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
