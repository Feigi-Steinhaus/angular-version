import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DocumentService } from '@app/Services/document.service';
import { ValidatorsService } from '@app/Services/validators.service';
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
  date!: Date;
  constructor(
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
    private vlidatorsService: ValidatorsService
  ) { }

  ngOnInit(): void {
    this.documentForm = this.formBuilder.group({
      documentId: [0],
      title: ['', [Validators.required, this.customNameValidator()]],
      description: ['', [Validators.required]],
      filePath: ['', [Validators.required]],
      relatedTo: ['', [Validators.required]],
      relatedId: ['', [Validators.required]],
      createdDate: ['', [Validators.required]],

    });
  }

  get formControls() { return this.documentForm.controls; }

  customNameValidator(): (control: FormControl) => ValidationErrors | null {
    return (control: FormControl): ValidationErrors | null => {
      return this.vlidatorsService.name(control.value) ? null : { invalidName: 'השם לא תקין' };
    };
  }

  openEditDocumentPopup() {
    const formElement = document.getElementById("addDocument");

    if (formElement) {
      this.originalParent = formElement.parentElement;

      Swal.fire({
        title: "הוספת מסמך",
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
      const formData = new FormData(); {
        formData.append('file',this.file,this.file.name);

      }
      this.documentService.upFile(formData).subscribe(res => {
        this.documentForm.patchValue({
          filePath: res

        })
      })
    };
  }


  addDocumentSubmit(): void {
    this.submitted = true;
if(this.documentForm.invalid)
  return;
    this.documentForm.patchValue({
      createdDate: this.date
    })
    console.log(this.documentForm.value);
alert('הקובץ הועלאה בהצלחה')
    // this.documentService.addDocument(this.documentForm.value).subscribe(response => {
    //   console.log('File uploaded successfully', response);
    // }, error => {
    //   console.error('File upload failed', error);
    // });
  }

}
