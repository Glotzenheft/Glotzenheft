import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationCardComponent } from './recommendation-card.component';

describe('RecommendationCardComponent', () => {
  let component: RecommendationCardComponent;
  let fixture: ComponentFixture<RecommendationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
