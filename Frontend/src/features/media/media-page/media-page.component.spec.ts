import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPageComponent } from './media-page.component';

describe('MediaPageComponent', () => {
  let component: MediaPageComponent;
  let fixture: ComponentFixture<MediaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
