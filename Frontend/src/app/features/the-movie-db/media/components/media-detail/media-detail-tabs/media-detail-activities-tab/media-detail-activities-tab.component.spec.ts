import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailActivitiesTabComponent } from './media-detail-activities-tab.component';

describe('MediaDetailActivitiesTabComponent', () => {
  let component: MediaDetailActivitiesTabComponent;
  let fixture: ComponentFixture<MediaDetailActivitiesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailActivitiesTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailActivitiesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
