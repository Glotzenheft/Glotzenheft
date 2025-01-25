import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonMainComponent } from './season-main.component';

describe('SeasonMainComponent', () => {
  let component: SeasonMainComponent;
  let fixture: ComponentFixture<SeasonMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
