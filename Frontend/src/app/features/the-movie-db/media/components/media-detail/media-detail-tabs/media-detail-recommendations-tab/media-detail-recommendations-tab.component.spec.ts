import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailRecommendationsTabComponent } from './media-detail-recommendations-tab.component';

describe('MediaDetailRecommendationsTabComponent', () => {
  let component: MediaDetailRecommendationsTabComponent;
  let fixture: ComponentFixture<MediaDetailRecommendationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailRecommendationsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailRecommendationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
