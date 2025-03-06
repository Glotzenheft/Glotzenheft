import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmPageComponent } from './film-page.component';

describe('FilmPageComponent', () => {
  let component: FilmPageComponent;
  let fixture: ComponentFixture<FilmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
