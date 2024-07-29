import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportToSheetComponent } from './export-to-sheet.component';

describe('ExportToSheetComponent', () => {
  let component: ExportToSheetComponent;
  let fixture: ComponentFixture<ExportToSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportToSheetComponent]
    });
    fixture = TestBed.createComponent(ExportToSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
