import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilseComponent } from './upload-filse.component';

describe('UploadFilseComponent', () => {
  let component: UploadFilseComponent;
  let fixture: ComponentFixture<UploadFilseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFilseComponent]
    });
    fixture = TestBed.createComponent(UploadFilseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
