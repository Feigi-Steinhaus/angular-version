import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropilComponent } from './propil.component';

describe('PropilComponent', () => {
  let component: PropilComponent;
  let fixture: ComponentFixture<PropilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropilComponent]
    });
    fixture = TestBed.createComponent(PropilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
