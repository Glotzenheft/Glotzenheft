import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsAndGroupsTabsComponent } from './tags-and-groups-tabs.component';

describe('TagsAndGroupsTabsComponent', () => {
  let component: TagsAndGroupsTabsComponent;
  let fixture: ComponentFixture<TagsAndGroupsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsAndGroupsTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsAndGroupsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
