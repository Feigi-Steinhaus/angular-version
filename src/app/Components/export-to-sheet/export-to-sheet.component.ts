import { Component, EventEmitter, Output } from '@angular/core';
import { SheetsApiService } from '@app/Services/sheets-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-export-to-sheet',
  templateUrl: './export-to-sheet.component.html',
  styleUrls: ['./export-to-sheet.component.css']
})
export class ExportToSheetComponent {
  formValues: any = {
    selectedOption: '',
    fileName: '',
    selectedFile: '',
    selectedSheetOption: '',
    sheetName: '',
    selectedSheet: ''
  };

  @Output() exportData = new EventEmitter<any>();

  constructor(
    private sheetsAPI: SheetsApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.existingFiles=await this.sheetsAPI.listGoogleSheets();
    console.log(this.existingFiles)
  }

  existingFiles: any = [];

  onSubmit(): void {
    this.exportData.emit(this.formValues as any);
    Swal.close();
  }

  onRadioChange(event: any): void {
    this.formValues.selectedOption = event.target.value;
  }
  async onSheetOptionChange(event: any): Promise<void> {
    this.formValues.selectedSheetOption = event.target.value;
  }

}
