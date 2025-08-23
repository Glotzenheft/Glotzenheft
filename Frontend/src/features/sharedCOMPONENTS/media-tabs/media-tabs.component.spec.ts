import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTabsComponent } from './media-tabs.component';

describe('MediaTabsComponent', () => {
  let component: MediaTabsComponent;
  let fixture: ComponentFixture<MediaTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
