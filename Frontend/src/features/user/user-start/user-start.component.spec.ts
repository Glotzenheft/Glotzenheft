import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStartComponent } from './user-start.component';

describe('UserStartComponent', () => {
  let component: UserStartComponent;
  let fixture: ComponentFixture<UserStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
