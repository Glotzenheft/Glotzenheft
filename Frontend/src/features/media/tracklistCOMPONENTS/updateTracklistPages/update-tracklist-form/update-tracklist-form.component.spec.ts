import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTracklistFormComponent } from './update-tracklist-form.component';

describe('UpdateTracklistFormComponent', () => {
  let component: UpdateTracklistFormComponent;
  let fixture: ComponentFixture<UpdateTracklistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTracklistFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTracklistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
