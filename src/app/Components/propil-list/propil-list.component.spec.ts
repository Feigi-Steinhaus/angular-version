import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropilListComponent } from './propil-list.component';

describe('PropilListComponent', () => {
  let component: PropilListComponent;
  let fixture: ComponentFixture<PropilListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropilListComponent]
    });
    fixture = TestBed.createComponent(PropilListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
