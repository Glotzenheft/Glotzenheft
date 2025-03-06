import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserAccountPageComponent } from './delete-user-account-page.component';

describe('DeleteUserAccountPageComponent', () => {
  let component: DeleteUserAccountPageComponent;
  let fixture: ComponentFixture<DeleteUserAccountPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserAccountPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserAccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
