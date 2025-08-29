import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRecommendationComponent } from './api-recommendation.component';

describe('ApiRecommendationComponent', () => {
  let component: ApiRecommendationComponent;
  let fixture: ComponentFixture<ApiRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiRecommendationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
