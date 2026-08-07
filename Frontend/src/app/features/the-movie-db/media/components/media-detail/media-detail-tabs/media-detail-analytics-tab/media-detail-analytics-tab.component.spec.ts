import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailAnalyticsTabComponent } from './media-detail-analytics-tab.component';

describe('MediaDetailAnalyticsTabComponent', () => {
  let component: MediaDetailAnalyticsTabComponent;
  let fixture: ComponentFixture<MediaDetailAnalyticsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailAnalyticsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailAnalyticsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
