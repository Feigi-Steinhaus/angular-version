import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerComponentComponent } from './worker-component.component';

describe('WorkerComponentComponent', () => {
  let component: WorkerComponentComponent;
  let fixture: ComponentFixture<WorkerComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkerComponentComponent]
    });
    fixture = TestBed.createComponent(WorkerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
