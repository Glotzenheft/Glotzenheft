import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaMetadataComponent } from './media-metadata.component';

describe('MediaMetadataComponent', () => {
  let component: MediaMetadataComponent;
  let fixture: ComponentFixture<MediaMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaMetadataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
