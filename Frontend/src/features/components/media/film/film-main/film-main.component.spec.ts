import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmMainComponent } from './film-main.component';

describe('FilmMainComponent', () => {
  let component: FilmMainComponent;
  let fixture: ComponentFixture<FilmMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
