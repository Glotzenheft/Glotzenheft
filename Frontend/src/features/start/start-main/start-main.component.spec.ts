import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMainComponent } from './start-main.component';

describe('StartMainComponent', () => {
  let component: StartMainComponent;
  let fixture: ComponentFixture<StartMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
