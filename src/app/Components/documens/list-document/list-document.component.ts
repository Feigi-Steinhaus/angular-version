import { Component, OnInit } from '@angular/core';
import { DocumentService } from '@app/Services/document.service';
import { ValidatorsService } from '@app/Services/validators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-document',
  templateUrl: './list-document.component.html',
  styleUrls: ['./list-document.component.css']
})
export class ListDocumentComponent implements OnInit{
  files: any[] = []; 
  constructor(
    private documentService: DocumentService,
    private vlidatorsService: ValidatorsService
  ) {}
ngOnInit(){
  this.loadFiles(); 
}

loadFiles(): void {
  this.documentService.getFiles().subscribe(files => {
    console.log(files); // בדיקת הנתונים המתקבלים מהשרת
    this.files = files;
  });
}

openImagePopup(thumbnailLink: string, webViewLink: string): void {
  Swal.fire({
    title: 'תצוגת מסמך',
    html: `<img src="${thumbnailLink}" style="width: 100%; height: auto;" />
           <br/>
           <a href="${webViewLink}" target="_blank">פתח את המסמך</a>`,
    showCloseButton: true,
    showConfirmButton: false,
  });
}
}
