import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonPageComponent } from './season-page.component';

describe('SeasonPageComponent', () => {
  let component: SeasonPageComponent;
  let fixture: ComponentFixture<SeasonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
