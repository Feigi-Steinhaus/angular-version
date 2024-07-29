import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DocumentService } from '@app/Services/document.service';
import { ValidatorsService } from '@app/Services/validators.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  file!: File;
  documentForm!: FormGroup;
  submitted: boolean = false;
  private originalParent: HTMLElement | null = null;
  trueTitle: boolean = false;
  nameCustomer!: string;
  date!: Date;
  constructor(
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
    private vlidatorsService: ValidatorsService,
    private translate: TranslateService,

  ) {

  }

  ngOnInit(): void {
    this.documentForm = this.formBuilder.group({
      documentId: [0],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      filePath: ['', [Validators.required, Validators.minLength(8)]],
      relatedTo: ['', [Validators.required]],
      relatedId: [0, [Validators.required]],
      createdDate: ['', [Validators.required]],

    });
    this.openEditDocumentPopup();

  }

  get formControls() { return this.documentForm.controls; }

  customNameValidator(): (control: FormControl) => ValidationErrors | null {
    return (control: FormControl): ValidationErrors | null => {
      return this.vlidatorsService.name(control.value) ? null : { invalidName: 'השם לא תקין' };
    };
  }
  setName(name: string) {
    this.nameCustomer = name;
  }
  openEditDocumentPopup() {
    const formElement = document.getElementById("addDocument");
    if (formElement) {
      this.originalParent = formElement.parentElement;

      Swal.fire({
        html: `<div id="popupContainer"></div>`,
        showConfirmButton: false,
        didOpen: () => {
          const container = document.getElementById('popupContainer');
          if (container) {
            container.appendChild(formElement);
            formElement.style.display = 'block';
          }
        },
        willClose: () => {
          this.documentForm.reset();
          if (formElement && this.originalParent) {
            formElement.style.display = 'none';
            this.originalParent.appendChild(formElement);
          }
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.file = input.files[0];
      const title = this.documentForm.controls['title'].value;
      const formData = new FormData(); {
        formData.append('file', this.file, title);
      }
      this.documentService.upFile(formData, this.nameCustomer).subscribe(res => {
        this.documentForm.patchValue({
          filePath: res

        })
      })
    };
  }

  addDocumentSubmit(): void {
    this.submitted = true;
    this.documentForm.patchValue({
      createdDate: new Date()
    });
    if (this.documentForm.value.description.invalid)
      return;
    if (this.documentForm.value.filePath.length < 8)
      return;
    if (this.documentForm.value.title.invalid)
      return;
    console.log(this.documentForm.value.filePath);
    this.documentService.addDocument(this.documentForm.value,this.nameCustomer).subscribe(res => {
      this.translate.get(['upLoadFile']).subscribe(translations => {

      alert(translations['upLoadFile'])
      Swal.close();
    
  })
  })
}
  changeTitle() {
    this.trueTitle = true;
  }
}
