import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodeUser } from '@app/Model/StatusCodeUser';
import { CustomersService } from '@app/Services/customers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-customer',
  templateUrl: './form-customer.component.html',
  styleUrls: ['./form-customer.component.css']
})
export class FormCustomerComponent {
 
  constructor(private formBuilder: FormBuilder,private customerService: CustomersService){

  }
  customerForm!: FormGroup;
  submitted: boolean = true;
  status: any;
  selectedStatus!: StatusCodeUser;
  statusCodeUser: StatusCodeUser[] = [];

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      customerId: [0],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      businessName: ['', [Validators.required]],
      source: ['', [Validators.required]],
      status: ['', [Validators.required]],
      createdDate: ['', [Validators.required]],
    });
    this.loadStatusUsers();
}
private loadStatusUsers(): void {
  this.customerService.GetAllStatusUser().subscribe(res => {
    this.statusCodeUser = res;
    if (this.statusCodeUser.length > 0) {
      this.selectedStatus = this.statusCodeUser[0];
    }
  });
}

editCustomerSubmit(): void {
  this.submitted = true;
  if (this.customerForm.invalid) {
    return;
  }
  
  this.customerForm.value.status = this.selectedStatus;
  
  this.customerService.EditCustomer(this.customerForm.value).subscribe(() => {
    this.customerForm.reset();
    this.submitted = false;
    Swal.close();
  });
}

selectItem(event: any) {
  this.status = event.target.value;
  this.selectedStatus = this.statusCodeUser.find(s => s.id == this.status) as StatusCodeUser;
}
data:any;
setData(data: any) {
  this.data = data;
  this.customerService.GetCustomerById(this.data).subscribe(res=>() => {
    this.customerForm.setValue(res);
  });
}
}
