import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadService } from '@app/Services/lead.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Lead } from '@app/Model/Lead';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.css']
})
export class EditLeadComponent {
  @Output() dataRefreshed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private lead: LeadService, private router: Router, private active: ActivatedRoute) { }

  fullForm() {
    this.editForm = this.formBuilder.group({
      email: [this.LeadToKnowInput.email, [Validators.required, Validators.email]],
      firstName: [this.LeadToKnowInput.firstName, [Validators.required]],
      lastName: [this.LeadToKnowInput.lastName, [Validators.required]],
      phone: [this.LeadToKnowInput.phone, [Validators.required]],
      source: [this.LeadToKnowInput.source, [Validators.required]],
      lastContactedDate: [this.extractDate(String(this.LeadToKnowInput.lastContactedDate)), [Validators.required, this.futureDateValidator()]],
      businessName: [this.LeadToKnowInput.businessName, [Validators.required]],
      notes: [this.LeadToKnowInput.notes, [Validators.required]],
    });
    this.flag = true;
  }

  extractDate(dateTime: string): string {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  setData(data: any) {
    this.data = data;
    this.lead.GetLeadById(this.data).subscribe((lead2: Lead) => {
      this.LeadToKnowInput = lead2;
      this.fullForm();
    });
  }

  data: any;
  editForm!: FormGroup;
  submitted = false;
  flag = false;
  showInput: boolean = false;
  allLeads: Lead[] = [];
  LeadToKnowInput: Lead = { leadId: 1, firstName: '', lastName: '', phone: '', email: '', source: '', createdDate: new Date(), lastContactedDate: new Date(), businessName: '', notes: '' };

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate > today ? null : { notFutureDate: true };
    };
  }

  get formControls() { return this.editForm.controls;}

  async toEnter() {
    this.submitted = true;
    if (this.editForm.invalid) { return; }
    this.lead.editLead(this.editForm.value, this.data).subscribe()
    await this.delay(50);
    Object.keys(this.editForm.controls).forEach((key) => {
      this.editForm.controls[key].markAsUntouched();
    });
    this.dataRefreshed.emit();
    Swal.close();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}









