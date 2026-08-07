import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailPersonsTabComponent } from './media-detail-persons-tab.component';

describe('MediaDetailPersonsTabComponent', () => {
  let component: MediaDetailPersonsTabComponent;
  let fixture: ComponentFixture<MediaDetailPersonsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaDetailPersonsTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaDetailPersonsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
