import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsAndGroupsComponent } from './tags-and-groups.component';

describe('TagsAndGroupsComponent', () => {
  let component: TagsAndGroupsComponent;
  let fixture: ComponentFixture<TagsAndGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsAndGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsAndGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
