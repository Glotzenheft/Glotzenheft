import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUserTracklistsComponent } from './all-user-tracklists.component';

describe('AllUserTracklistsComponent', () => {
  let component: AllUserTracklistsComponent;
  let fixture: ComponentFixture<AllUserTracklistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllUserTracklistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllUserTracklistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
