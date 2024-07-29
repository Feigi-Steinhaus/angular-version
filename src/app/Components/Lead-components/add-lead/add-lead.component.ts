import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Lead } from 'src/app/Model/Lead';
import { LeadService } from '../../../Services/lead.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css'],
})
export class AddLeadComponent {
  
  @Output() dataRefreshed: EventEmitter<void> = new EventEmitter<void>();
  userForm: FormGroup;
 

  constructor(
    private formBuilder: FormBuilder,
    private leadSrv: LeadService,
    private router: Router
  ) {
    // בניית הטופס בעזרת FormBuilder
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(12),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      source: ['', [Validators.required]],
      createdDate: [new Date()],
      lastContactedDate: [new Date()],
      businessName: ['', [Validators.required]],
      notes: [''],
    });
  }

   submitForm = () => {
    let formData = this.userForm.value;
    this.leadSrv.addLead(formData).subscribe((lead) => {
      alert('הליד נוסף בהצלחה' + lead);
      this.userForm.reset();
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.controls[key].markAsUntouched();
      });
       this.dataRefreshed.emit();
      Swal.close();
    });
        
  };

  backListLeadsPage = () => {
    this.router.navigate(['leads']);
  };
}